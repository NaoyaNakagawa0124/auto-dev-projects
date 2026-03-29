"""NestPlan — Main Textual TUI Application."""

from __future__ import annotations

import os
from pathlib import Path

from textual import on, work
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Horizontal, Vertical, VerticalScroll
from textual.css.query import NoMatches
from textual.screen import ModalScreen
from textual.widgets import (
    Button,
    Footer,
    Header,
    Input,
    Label,
    ListItem,
    ListView,
    OptionList,
    ProgressBar,
    Select,
    Static,
    TextArea,
)
from textual.widgets.option_list import Option

from .budget import (
    format_currency,
    partner_budget_breakdown,
    remaining_budget,
    room_budget_breakdown,
    spent_budget,
    total_budget,
)
from .models import (
    Partner,
    Plan,
    Project,
    ProjectStatus,
    Room,
    get_room_icon,
)
from .storage import load_plan, plan_exists, save_plan


# ─── Screens ────────────────────────────────────────────────────────────────


class SetupScreen(ModalScreen[Plan]):
    """First-time setup: enter partner names and plan name."""

    DEFAULT_CSS = """
    SetupScreen {
        align: center middle;
    }
    #setup-box {
        width: 60;
        height: auto;
        max-height: 24;
        background: $surface;
        border: round $primary;
        padding: 2 4;
    }
    #setup-box Label {
        margin-bottom: 1;
    }
    #setup-box Input {
        margin-bottom: 1;
    }
    #setup-start {
        margin-top: 1;
        width: 100%;
    }
    """

    def compose(self) -> ComposeResult:
        with Vertical(id="setup-box"):
            yield Label("[bold]Welcome to NestPlan[/bold]")
            yield Label("Plan your future home together.")
            yield Label("")
            yield Label("Plan name:")
            yield Input(placeholder="Our Dream Home", id="plan-name")
            yield Label("Partner 1 name:")
            yield Input(placeholder="Alice", id="partner1")
            yield Label("Partner 2 name:")
            yield Input(placeholder="Bob", id="partner2")
            yield Button("Start Planning", variant="primary", id="setup-start")

    @on(Button.Pressed, "#setup-start")
    def start(self) -> None:
        plan_name = self.query_one("#plan-name", Input).value.strip() or "Our Home"
        p1 = self.query_one("#partner1", Input).value.strip() or "Partner 1"
        p2 = self.query_one("#partner2", Input).value.strip() or "Partner 2"
        plan = Plan(name=plan_name, partners=[Partner(p1), Partner(p2)])
        self.dismiss(plan)


class AddRoomScreen(ModalScreen[str | None]):
    """Modal to add a new room."""

    DEFAULT_CSS = """
    AddRoomScreen {
        align: center middle;
    }
    #add-room-box {
        width: 50;
        height: auto;
        background: $surface;
        border: round $accent;
        padding: 2 4;
    }
    #add-room-box Input {
        margin: 1 0;
    }
    .room-preset {
        margin: 0 1 0 0;
    }
    #room-presets {
        height: auto;
        margin-bottom: 1;
    }
    """

    def compose(self) -> ComposeResult:
        with Vertical(id="add-room-box"):
            yield Label("[bold]Add Room[/bold]")
            yield Input(placeholder="Room name (e.g., Kitchen)", id="room-name-input")
            yield Label("Or pick a preset:")
            with Horizontal(id="room-presets"):
                for name in ["Kitchen", "Bedroom", "Living Room", "Bathroom", "Office", "Garden"]:
                    yield Button(f"{get_room_icon(name)} {name}", classes="room-preset", id=f"preset-{name.lower().replace(' ', '-')}")
            with Horizontal():
                yield Button("Add", variant="primary", id="add-room-ok")
                yield Button("Cancel", id="add-room-cancel")

    @on(Button.Pressed, ".room-preset")
    def preset_clicked(self, event: Button.Pressed) -> None:
        name = event.button.label.plain.split(" ", 1)[-1] if " " in event.button.label.plain else event.button.label.plain
        self.query_one("#room-name-input", Input).value = name

    @on(Button.Pressed, "#add-room-ok")
    def confirm(self) -> None:
        name = self.query_one("#room-name-input", Input).value.strip()
        self.dismiss(name if name else None)

    @on(Button.Pressed, "#add-room-cancel")
    def cancel(self) -> None:
        self.dismiss(None)


class AddProjectScreen(ModalScreen[dict | None]):
    """Modal to add a project to a room."""

    DEFAULT_CSS = """
    AddProjectScreen {
        align: center middle;
    }
    #add-proj-box {
        width: 64;
        height: auto;
        background: $surface;
        border: round $accent;
        padding: 2 4;
    }
    #add-proj-box Input, #add-proj-box Select {
        margin: 0 0 1 0;
    }
    """

    def __init__(self, partners: list[str]) -> None:
        super().__init__()
        self.partners = partners

    def compose(self) -> ComposeResult:
        options = [(p, p) for p in self.partners] + [("Unassigned", "")]
        with Vertical(id="add-proj-box"):
            yield Label("[bold]Add Project[/bold]")
            yield Label("Name:")
            yield Input(placeholder="e.g., Install backsplash", id="proj-name")
            yield Label("Description:")
            yield Input(placeholder="Details...", id="proj-desc")
            yield Label("Budget ($):")
            yield Input(placeholder="0", id="proj-budget", type="number")
            yield Label("Assign to:")
            yield Select(options, value="", id="proj-assign")
            with Horizontal():
                yield Button("Add", variant="primary", id="add-proj-ok")
                yield Button("Cancel", id="add-proj-cancel")

    @on(Button.Pressed, "#add-proj-ok")
    def confirm(self) -> None:
        name = self.query_one("#proj-name", Input).value.strip()
        if not name:
            self.dismiss(None)
            return
        desc = self.query_one("#proj-desc", Input).value.strip()
        try:
            budget = float(self.query_one("#proj-budget", Input).value or 0)
        except ValueError:
            budget = 0.0
        assign = self.query_one("#proj-assign", Select).value
        self.dismiss({
            "name": name,
            "description": desc,
            "budget": budget,
            "assigned_to": assign if assign else None,
        })

    @on(Button.Pressed, "#add-proj-cancel")
    def cancel(self) -> None:
        self.dismiss(None)


class VoteScreen(ModalScreen[dict | None]):
    """Modal for partner voting on a project."""

    DEFAULT_CSS = """
    VoteScreen {
        align: center middle;
    }
    #vote-box {
        width: 50;
        height: auto;
        background: $surface;
        border: round $warning;
        padding: 2 4;
    }
    .star-row {
        height: auto;
        margin: 1 0;
    }
    .star-btn {
        min-width: 5;
        margin: 0 1 0 0;
    }
    """

    def __init__(self, project_name: str, partners: list[str], current_votes: dict[str, int]) -> None:
        super().__init__()
        self.project_name = project_name
        self.partners = partners
        self.current_votes = current_votes
        self.new_votes: dict[str, int] = dict(current_votes)

    def compose(self) -> ComposeResult:
        with Vertical(id="vote-box"):
            yield Label(f"[bold]Vote: {self.project_name}[/bold]")
            yield Label("")
            for partner in self.partners:
                current = self.current_votes.get(partner, 0)
                yield Label(f"{partner}:")
                with Horizontal(classes="star-row"):
                    for s in range(1, 6):
                        filled = s <= current
                        yield Button(
                            "\u2605" if filled else "\u2606",
                            classes="star-btn",
                            id=f"star-{partner}-{s}",
                            variant="warning" if filled else "default",
                        )
            yield Label("")
            with Horizontal():
                yield Button("Save Votes", variant="primary", id="vote-save")
                yield Button("Cancel", id="vote-cancel")

    @on(Button.Pressed, ".star-btn")
    def star_clicked(self, event: Button.Pressed) -> None:
        parts = event.button.id.split("-")
        # star-{partner}-{n} — partner name may contain hyphens
        stars = int(parts[-1])
        partner = "-".join(parts[1:-1])
        self.new_votes[partner] = stars
        # Update visual
        for s in range(1, 6):
            try:
                btn = self.query_one(f"#star-{partner}-{s}", Button)
                filled = s <= stars
                btn.label = "\u2605" if filled else "\u2606"
                btn.variant = "warning" if filled else "default"
            except NoMatches:
                pass

    @on(Button.Pressed, "#vote-save")
    def save(self) -> None:
        self.dismiss(self.new_votes)

    @on(Button.Pressed, "#vote-cancel")
    def cancel(self) -> None:
        self.dismiss(None)


# ─── Main App ───────────────────────────────────────────────────────────────


class NestPlanApp(App):
    """NestPlan — Plan your future home together."""

    TITLE = "NestPlan"
    SUB_TITLE = "Plan your future home together"

    CSS = """
    #main {
        layout: horizontal;
        height: 1fr;
    }
    #sidebar {
        width: 28;
        background: $surface;
        border-right: solid $primary;
        padding: 1;
    }
    #sidebar-title {
        text-align: center;
        text-style: bold;
        margin-bottom: 1;
    }
    #room-list {
        height: 1fr;
    }
    #add-room-btn {
        width: 100%;
        margin-top: 1;
    }
    #content {
        width: 1fr;
        padding: 1 2;
    }
    #room-header {
        height: 3;
        margin-bottom: 1;
    }
    #room-title {
        text-style: bold;
        content-align: left middle;
    }
    #project-list {
        height: 1fr;
    }
    .project-item {
        height: auto;
        padding: 1;
        margin-bottom: 1;
        background: $surface;
        border: solid $primary-lighten-2;
    }
    .project-item:hover {
        background: $primary-background;
    }
    .proj-title {
        text-style: bold;
    }
    .proj-meta {
        color: $text-muted;
    }
    .proj-stars {
        color: $warning;
    }
    #project-actions {
        height: auto;
        margin-top: 1;
    }
    #budget-panel {
        height: auto;
        max-height: 16;
        background: $surface;
        border-top: solid $accent;
        padding: 1 2;
    }
    .budget-line {
        margin-bottom: 0;
    }
    #empty-state {
        width: 100%;
        height: 100%;
        content-align: center middle;
        color: $text-muted;
    }
    #welcome {
        width: 100%;
        height: 100%;
        content-align: center middle;
    }
    """

    BINDINGS = [
        Binding("r", "add_room", "Add Room"),
        Binding("p", "add_project", "Add Project"),
        Binding("s", "save", "Save"),
        Binding("e", "export", "Export"),
        Binding("q", "quit", "Quit"),
    ]

    def __init__(self, plan_file: str | None = None) -> None:
        super().__init__()
        self.plan_file = plan_file
        self.plan: Plan | None = None
        self.selected_room_id: str | None = None

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="main"):
            with Vertical(id="sidebar"):
                yield Static("[b]Rooms[/b]", id="sidebar-title")
                yield OptionList(id="room-list")
                yield Button("+ Add Room", variant="primary", id="add-room-btn")
            with Vertical(id="content"):
                yield Static("[dim]Select or add a room to begin[/dim]", id="welcome")
        yield Footer()

    def on_mount(self) -> None:
        if self.plan_file and plan_exists(self.plan_file):
            self.plan = load_plan(self.plan_file)
            self._refresh_rooms()
        else:
            self.push_screen(SetupScreen(), callback=self._on_setup_done)

    def _on_setup_done(self, plan: Plan | None) -> None:
        if plan is None:
            self.exit()
            return
        self.plan = plan
        self._refresh_rooms()

    def _refresh_rooms(self) -> None:
        if not self.plan:
            return
        room_list = self.query_one("#room-list", OptionList)
        room_list.clear_options()
        for room in self.plan.rooms:
            label = f"{room.icon} {room.name}  ({room.project_count})"
            room_list.add_option(Option(label, id=room.id))
        self._update_title()

    def _update_title(self) -> None:
        if self.plan:
            self.sub_title = f"{self.plan.name} \u2014 {self.plan.total_projects} projects, {format_currency(self.plan.total_budget)} budget"

    @on(OptionList.OptionSelected, "#room-list")
    def room_selected(self, event: OptionList.OptionSelected) -> None:
        self.selected_room_id = str(event.option.id)
        self._render_room()

    def _render_room(self) -> None:
        if not self.plan or not self.selected_room_id:
            return
        room = self.plan.get_room(self.selected_room_id)
        if not room:
            return

        content = self.query_one("#content", Vertical)
        content.remove_children()

        # Room header
        content.mount(Static(f"[bold]{room.icon} {room.name}[/bold] \u2014 {room.project_count} projects, {format_currency(room.total_budget)} budget", id="room-title"))

        if not room.projects:
            content.mount(Static("[dim]No projects yet. Press [b]p[/b] to add one.[/dim]", id="empty-state"))
        else:
            scroll = VerticalScroll(id="project-list")
            content.mount(scroll)
            for proj in room.projects_by_priority():
                stars_display = self._stars_display(proj)
                status_icon = {
                    ProjectStatus.PLANNED: "\U0001f4cb",
                    ProjectStatus.IN_PROGRESS: "\U0001f528",
                    ProjectStatus.DONE: "\u2705",
                }[proj.status]

                assigned = f" \u2192 {proj.assigned_to}" if proj.assigned_to else ""
                budget_str = format_currency(proj.budget) if proj.budget > 0 else ""

                block = Vertical(classes="project-item", id=f"proj-{proj.id}")
                scroll.mount(block)
                block.mount(Static(f"[bold]{status_icon} {proj.name}[/bold]{assigned}  {budget_str}", classes="proj-title"))
                if proj.description:
                    block.mount(Static(f"  {proj.description}", classes="proj-meta"))
                block.mount(Static(f"  Priority: {stars_display} ({proj.priority_score:.1f}/5)", classes="proj-stars"))

                with block.compose_add_empty():
                    actions = Horizontal(classes="project-actions")
                block.mount(actions)
                actions.mount(Button("Vote", variant="warning", id=f"vote-{proj.id}"))
                next_status = self._next_status(proj.status)
                if next_status:
                    actions.mount(Button(f"\u2192 {next_status.value.replace('_', ' ').title()}", variant="success", id=f"status-{proj.id}"))
                actions.mount(Button("Delete", variant="error", id=f"del-{proj.id}"))

        # Budget summary at bottom
        self._render_budget_bar(content)

    def _stars_display(self, project: Project) -> str:
        if not self.plan:
            return ""
        parts = []
        for partner in self.plan.partners:
            vote = project.get_vote(partner.name)
            if vote:
                stars = "\u2605" * vote.stars + "\u2606" * (5 - vote.stars)
                parts.append(f"{partner.name}: {stars}")
            else:
                parts.append(f"{partner.name}: \u2606\u2606\u2606\u2606\u2606")
        return " | ".join(parts)

    def _next_status(self, status: ProjectStatus) -> ProjectStatus | None:
        if status == ProjectStatus.PLANNED:
            return ProjectStatus.IN_PROGRESS
        if status == ProjectStatus.IN_PROGRESS:
            return ProjectStatus.DONE
        return None

    def _render_budget_bar(self, container: Vertical) -> None:
        if not self.plan:
            return
        total = total_budget(self.plan)
        spent = spent_budget(self.plan)
        pct = self.plan.completion_pct

        panel = Vertical(id="budget-panel")
        container.mount(panel)
        panel.mount(Static(f"[bold]Budget Overview[/bold]  {format_currency(spent)} / {format_currency(total)}  ({pct:.0f}% complete)", classes="budget-line"))

        # Per-partner
        partner_b = partner_budget_breakdown(self.plan)
        for name, info in partner_b.items():
            panel.mount(Static(f"  {name}: {format_currency(info['spent'])} spent / {format_currency(info['total'])} total ({info['projects']} projects)", classes="budget-line"))

    # ─── Actions ──────────────────────────────────────────────────────

    def action_add_room(self) -> None:
        if not self.plan:
            return
        self.push_screen(AddRoomScreen(), callback=self._on_add_room)

    @on(Button.Pressed, "#add-room-btn")
    def add_room_btn(self) -> None:
        self.action_add_room()

    def _on_add_room(self, name: str | None) -> None:
        if name and self.plan:
            room = Room(name=name)
            self.plan.add_room(room)
            self._refresh_rooms()
            self.selected_room_id = room.id
            self._render_room()
            self._auto_save()

    def action_add_project(self) -> None:
        if not self.plan or not self.selected_room_id:
            self.notify("Select a room first", severity="warning")
            return
        partners = [p.name for p in self.plan.partners]
        self.push_screen(AddProjectScreen(partners), callback=self._on_add_project)

    def _on_add_project(self, data: dict | None) -> None:
        if data and self.plan and self.selected_room_id:
            room = self.plan.get_room(self.selected_room_id)
            if room:
                proj = Project(
                    name=data["name"],
                    description=data["description"],
                    budget=data["budget"],
                    assigned_to=data["assigned_to"],
                )
                room.add_project(proj)
                self._render_room()
                self._refresh_rooms()
                self._auto_save()

    @on(Button.Pressed)
    def handle_button(self, event: Button.Pressed) -> None:
        btn_id = event.button.id or ""

        if btn_id.startswith("vote-"):
            proj_id = btn_id[5:]
            self._open_vote(proj_id)
        elif btn_id.startswith("status-"):
            proj_id = btn_id[7:]
            self._advance_status(proj_id)
        elif btn_id.startswith("del-"):
            proj_id = btn_id[4:]
            self._delete_project(proj_id)

    def _open_vote(self, project_id: str) -> None:
        if not self.plan or not self.selected_room_id:
            return
        room = self.plan.get_room(self.selected_room_id)
        if not room:
            return
        project = room.get_project(project_id)
        if not project:
            return

        partners = [p.name for p in self.plan.partners]
        current = {p: (project.get_vote(p).stars if project.get_vote(p) else 0) for p in partners}

        def on_vote(votes: dict | None) -> None:
            if votes and project:
                for name, stars in votes.items():
                    if stars > 0:
                        project.set_vote(name, stars)
                self._render_room()
                self._auto_save()

        self.push_screen(VoteScreen(project.name, partners, current), callback=on_vote)

    def _advance_status(self, project_id: str) -> None:
        if not self.plan or not self.selected_room_id:
            return
        room = self.plan.get_room(self.selected_room_id)
        if not room:
            return
        project = room.get_project(project_id)
        if not project:
            return
        next_s = self._next_status(project.status)
        if next_s:
            project.status = next_s
            self._render_room()
            self._refresh_rooms()
            self._auto_save()
            self.notify(f"{project.name} \u2192 {next_s.value.replace('_', ' ').title()}")

    def _delete_project(self, project_id: str) -> None:
        if not self.plan or not self.selected_room_id:
            return
        room = self.plan.get_room(self.selected_room_id)
        if room:
            room.remove_project(project_id)
            self._render_room()
            self._refresh_rooms()
            self._auto_save()

    def _auto_save(self) -> None:
        if self.plan:
            filepath = self.plan_file or "nestplan.json"
            save_plan(self.plan, filepath)

    def action_save(self) -> None:
        self._auto_save()
        self.notify("Plan saved!")

    def action_export(self) -> None:
        if self.plan:
            export_path = f"{self.plan.name.lower().replace(' ', '_')}_export.json"
            save_plan(self.plan, export_path)
            self.notify(f"Exported to {export_path}")
