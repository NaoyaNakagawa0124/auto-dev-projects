"""NestPlan budget calculation utilities."""

from __future__ import annotations

from .models import Plan, ProjectStatus, Room


def total_budget(plan: Plan) -> float:
    return plan.total_budget


def spent_budget(plan: Plan) -> float:
    return sum(
        p.budget for p in plan.all_projects() if p.status == ProjectStatus.DONE
    )


def remaining_budget(plan: Plan) -> float:
    return total_budget(plan) - spent_budget(plan)


def room_budget_breakdown(plan: Plan) -> list[dict]:
    result = []
    for room in plan.rooms:
        done = sum(
            p.budget for p in room.projects if p.status == ProjectStatus.DONE
        )
        planned = room.total_budget
        result.append({
            "room": room.name,
            "icon": room.icon,
            "total": planned,
            "spent": done,
            "remaining": planned - done,
            "projects": room.project_count,
            "completed": room.completed_count,
        })
    return result


def partner_budget_breakdown(plan: Plan) -> dict[str, dict]:
    result: dict[str, dict] = {}
    for partner in plan.partners:
        result[partner.name] = {"total": 0.0, "spent": 0.0, "projects": 0}

    for project in plan.all_projects():
        key = project.assigned_to
        if key and key in result:
            result[key]["total"] += project.budget
            result[key]["projects"] += 1
            if project.status == ProjectStatus.DONE:
                result[key]["spent"] += project.budget

    return result


def format_currency(amount: float) -> str:
    if amount >= 1000:
        return f"${amount:,.0f}"
    return f"${amount:.2f}"
