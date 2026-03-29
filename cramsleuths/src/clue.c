#include "clue.h"
#include <stddef.h>

static Clue make_clue(int id, const char *name, const char *desc, bool coop)
{
    return (Clue){
        .id = id, .name = name, .description = desc,
        .found = false, .found_by = -1, .requires_coop = coop
    };
}

ClueSystem clue_system_init(void)
{
    ClueSystem sys = {0};
    sys.case_title = "The Missing Thesis";
    sys.case_intro =
        "Professor Chen's groundbreaking thesis has vanished from the\n"
        "campus library. Two student detectives must search the Library,\n"
        "Lab, and Office to find clues and crack the case before dawn.";
    sys.case_solution =
        "The janitor copied the thesis onto a USB drive found in the\n"
        "office drawer, planning to sell it. Chemical stains on the torn\n"
        "page match the lab's broken beaker — he spilled coffee while\n"
        "sneaking through. The laptop logs confirm access at 1:47 AM.";

    /* Clues — ids must match RoomObject clue_ids */
    sys.clues[sys.clue_count++] = make_clue(0,
        "Torn Page", "A page ripped from the thesis with coffee stains.", false);
    sys.clues[sys.clue_count++] = make_clue(1,
        "Old Reference Book", "Bookmarked to the chapter the thesis cited. Fingerprints on it.", false);
    sys.clues[sys.clue_count++] = make_clue(2,
        "Hidden Note", "A note reading: 'Copy files BEFORE 2am. -J'", true);
    sys.clues[sys.clue_count++] = make_clue(3,
        "Chemical Report", "A report showing the coffee compound found on the torn page.", false);
    sys.clues[sys.clue_count++] = make_clue(4,
        "Broken Beaker", "Shattered glass with coffee residue. Someone was here recently.", false);
    sys.clues[sys.clue_count++] = make_clue(5,
        "Safe Contents", "A USB drive labeled 'THESIS BACKUP' hidden in the lab safe.", true);
    sys.clues[sys.clue_count++] = make_clue(6,
        "Laptop Access Log", "Last login at 1:47 AM by user 'janitor_night'.", false);
    sys.clues[sys.clue_count++] = make_clue(7,
        "Drawer Evidence", "Janitor's badge and a printed email about selling research.", true);
    sys.clues[sys.clue_count++] = make_clue(8,
        "Coffee Mug", "Mug with the janitor's name: 'Jim'. Still warm.", false);

    /* Deduction choices */
    sys.choices[sys.choice_count++] = (DeductionChoice){
        "Professor Chen hid it herself for insurance fraud.", false};
    sys.choices[sys.choice_count++] = (DeductionChoice){
        "The janitor copied and stole the thesis to sell it.", true};
    sys.choices[sys.choice_count++] = (DeductionChoice){
        "A rival student shredded it out of jealousy.", false};
    sys.choices[sys.choice_count++] = (DeductionChoice){
        "It was accidentally recycled by campus cleaning crew.", false};

    return sys;
}

bool clue_find(ClueSystem *sys, int clue_id, int player_id)
{
    for (int i = 0; i < sys->clue_count; i++) {
        if (sys->clues[i].id == clue_id && !sys->clues[i].found) {
            sys->clues[i].found = true;
            sys->clues[i].found_by = player_id;
            sys->found_count++;
            return true;
        }
    }
    return false;
}

bool clue_is_found(const ClueSystem *sys, int clue_id)
{
    for (int i = 0; i < sys->clue_count; i++) {
        if (sys->clues[i].id == clue_id) return sys->clues[i].found;
    }
    return false;
}

const Clue *clue_get(const ClueSystem *sys, int clue_id)
{
    for (int i = 0; i < sys->clue_count; i++) {
        if (sys->clues[i].id == clue_id) return &sys->clues[i];
    }
    return NULL;
}

bool clue_all_found(const ClueSystem *sys)
{
    return sys->found_count >= sys->clue_count;
}

int clue_found_count(const ClueSystem *sys)
{
    return sys->found_count;
}

bool clue_check_answer(const ClueSystem *sys, int choice_idx)
{
    if (choice_idx < 0 || choice_idx >= sys->choice_count) return false;
    return sys->choices[choice_idx].correct;
}
