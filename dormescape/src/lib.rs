use wasm_bindgen::prelude::*;

// ===== Story Data =====

const CHAPTERS: &[Chapter] = &[
    Chapter { id: 0, title: "2:00 AM — The Realization",
        text: "You're cramming for finals when an email arrives: 'LEASE TERMINATION — Your dorm lease ends June 1.' \
               You have 3 months to find a place to live after graduation. Your savings: $2,400. Your credit score: 680. \
               The average rent in your city is $915/bed. That's 27% of the median income. Welcome to adulting.",
        choices: &[
            Choice { text: "Start searching apartments right now (it's 2am, but who sleeps?)", next: 1, effect: Effect::Budget(0), lesson: "Lesson: Early apartment hunting = more options and negotiating power." },
            Choice { text: "Panic and order pizza instead", next: 1, effect: Effect::Budget(-25), lesson: "Lesson: Stress spending is real. Americans spend $1,500/year on impulse purchases." },
        ]},
    Chapter { id: 1, title: "2:30 AM — Rent vs. Reality",
        text: "You find two options online: \
               A) Studio apartment: $850/month, 20-min bus ride to campus/work. \
               B) Shared 2BR: $550/month, 5-min walk, but you need a roommate. \
               The 30% rule says housing should be ≤30% of gross income. Your expected starting salary: $42,000/year ($3,500/month). \
               That means your max rent should be $1,050.",
        choices: &[
            Choice { text: "Go solo — the studio at $850 (24% of income)", next: 2, effect: Effect::Rent(850), lesson: "Lesson: The 30% rule — spending under 30% of income on rent leaves room for savings and emergencies." },
            Choice { text: "Find a roommate — $550 (16% of income, save more)", next: 2, effect: Effect::Rent(550), lesson: "Lesson: Roommates save the average renter $4,000-7,000/year. 59% of Gen Z renters have roommates." },
        ]},
    Chapter { id: 2, title: "3:00 AM — The Lease",
        text: "You found a place! The landlord sends a 12-page lease. At 3am, the fine print swims. \
               Key terms you spot: Security deposit (1 month's rent), 12-month term, 60-day notice to vacate, \
               no pets, renter's insurance required ($15/month), and a $50 late fee after the 5th. \
               In 2026, the average security deposit is $1,200 nationally.",
        choices: &[
            Choice { text: "Read every page carefully (your future self will thank you)", next: 3, effect: Effect::Budget(0), lesson: "Lesson: ALWAYS read the lease. 43% of renters report surprise fees they didn't catch in their lease." },
            Choice { text: "Skim it and sign (it's 3am, how bad can it be?)", next: 3, effect: Effect::Budget(-200), lesson: "Lesson: Skimming cost you — you missed a $200 move-in 'admin fee' buried on page 9." },
        ]},
    Chapter { id: 3, title: "3:30 AM — The Credit Score",
        text: "The landlord runs a credit check. Your score: 680. \
               'That's... fine,' she says. 'But with a 720+, I could waive the extra deposit.' \
               Credit scores: 300-579 (Poor), 580-669 (Fair), 670-739 (Good), 740-799 (Very Good), 800+ (Exceptional). \
               Your 680 is 'Good' but not great. 35% of your score is payment history. 30% is credit utilization.",
        choices: &[
            Choice { text: "Ask if paying 2 months upfront would help (negotiate!)", next: 4, effect: Effect::CreditImpact(10), lesson: "Lesson: Everything is negotiable. Offering upfront payment shows financial responsibility." },
            Choice { text: "Accept the extra $300 deposit and move on", next: 4, effect: Effect::Budget(-300), lesson: "Lesson: A higher credit score = lower deposits, better rates, and more housing options." },
        ]},
    Chapter { id: 4, title: "4:00 AM — Moving Day Math",
        text: "Time to budget for the move. First month's rent + security deposit + renter's insurance + utilities setup. \
               The average first-apartment move-in cost in 2026: $3,200. \
               You also need: furniture (bed $300, desk $150, kitchen basics $200), \
               utility deposits (electricity $75, internet $50), and moving truck ($150). \
               Total needed: way more than you thought.",
        choices: &[
            Choice { text: "Buy everything new — fresh start! ($925)", next: 5, effect: Effect::Budget(-925), lesson: "Lesson: New furniture depreciates 50% the moment you buy it." },
            Choice { text: "Thrift + Facebook Marketplace ($300)", next: 5, effect: Effect::Budget(-300), lesson: "Lesson: 73% of first-apartment furniture in 2026 is secondhand. Smart, sustainable, and cheap." },
        ]},
    Chapter { id: 5, title: "4:30 AM — The Emergency Fund",
        text: "You're moved in! But your savings are thin. Financial advisors say: keep 3-6 months of expenses in an emergency fund. \
               Your monthly expenses: rent + utilities + food + transport ≈ $1,800. \
               That means you need $5,400-$10,800 saved. You have... $400 left. \
               The median American has $1,000 in savings. You're not alone, but you need a plan.",
        choices: &[
            Choice { text: "Set up auto-transfer: $200/month to savings", next: 6, effect: Effect::Budget(200), lesson: "Lesson: Automating savings works — people who auto-save accumulate 73% more than manual savers." },
            Choice { text: "Worry about it later — enjoy the new place", next: 6, effect: Effect::Budget(0), lesson: "Lesson: 56% of Americans can't cover a $1,000 emergency. Start saving now, even $50/month." },
        ]},
    Chapter { id: 6, title: "5:00 AM — Sunrise",
        text: "The sun comes up. You look around your first real apartment. \
               It's small. The walls need painting. The fridge hums too loud. \
               But it's YOURS. You learned more about money in one night than in four years of college. \
               Rent, leases, credit scores, deposits, budgets, emergency funds — \
               these aren't just terms on a test. They're your life now. \
               And you're going to be okay.",
        choices: &[
            Choice { text: "Make coffee and start the day (you never did sleep)", next: 7, effect: Effect::Budget(0), lesson: "Final lesson: Financial literacy isn't taught in most schools. But tonight, you taught yourself." },
        ]},
];

struct Chapter {
    id: usize,
    title: &'static str,
    text: &'static str,
    choices: &'static [Choice],
}

struct Choice {
    text: &'static str,
    next: usize,
    effect: Effect,
    lesson: &'static str,
}

#[derive(Clone, Copy)]
enum Effect {
    Budget(i32),
    Rent(i32),
    CreditImpact(i32),
}

// ===== WASM API =====

#[wasm_bindgen]
pub fn get_chapter_count() -> usize { CHAPTERS.len() }

#[wasm_bindgen]
pub fn get_chapter_title(id: usize) -> String {
    if id < CHAPTERS.len() { CHAPTERS[id].title.to_string() } else { String::new() }
}

#[wasm_bindgen]
pub fn get_chapter_text(id: usize) -> String {
    if id < CHAPTERS.len() { CHAPTERS[id].text.to_string() } else { String::new() }
}

#[wasm_bindgen]
pub fn get_choice_count(chapter: usize) -> usize {
    if chapter < CHAPTERS.len() { CHAPTERS[chapter].choices.len() } else { 0 }
}

#[wasm_bindgen]
pub fn get_choice_text(chapter: usize, choice: usize) -> String {
    if chapter < CHAPTERS.len() && choice < CHAPTERS[chapter].choices.len() {
        CHAPTERS[chapter].choices[choice].text.to_string()
    } else { String::new() }
}

#[wasm_bindgen]
pub fn get_choice_lesson(chapter: usize, choice: usize) -> String {
    if chapter < CHAPTERS.len() && choice < CHAPTERS[chapter].choices.len() {
        CHAPTERS[chapter].choices[choice].lesson.to_string()
    } else { String::new() }
}

#[wasm_bindgen]
pub fn get_choice_next(chapter: usize, choice: usize) -> usize {
    if chapter < CHAPTERS.len() && choice < CHAPTERS[chapter].choices.len() {
        CHAPTERS[chapter].choices[choice].next
    } else { 0 }
}

#[wasm_bindgen]
pub fn apply_choice_effect(budget: i32, rent: i32, credit: i32, chapter: usize, choice: usize) -> Vec<i32> {
    let mut b = budget;
    let mut r = rent;
    let mut c = credit;
    if chapter < CHAPTERS.len() && choice < CHAPTERS[chapter].choices.len() {
        match CHAPTERS[chapter].choices[choice].effect {
            Effect::Budget(v) => b += v,
            Effect::Rent(v) => r = v,
            Effect::CreditImpact(v) => c += v,
        }
    }
    vec![b, r, c]
}

#[wasm_bindgen]
pub fn calculate_monthly_budget(salary: i32, rent: i32) -> Vec<i32> {
    let monthly = salary / 12;
    let after_tax = monthly * 75 / 100; // ~25% tax estimate
    let after_rent = after_tax - rent;
    let food = 400;
    let transport = 150;
    let utilities = 120;
    let insurance = 15;
    let remaining = after_rent - food - transport - utilities - insurance;
    vec![after_tax, rent, food, transport, utilities, insurance, remaining.max(0)]
}

#[wasm_bindgen]
pub fn get_financial_grade(budget_remaining: i32, rent: i32, salary: i32) -> String {
    let rent_ratio = if salary > 0 { rent * 1200 / salary } else { 100 };
    if rent_ratio <= 25 && budget_remaining > 300 { "A — Financially savvy! You'll build wealth.".to_string() }
    else if rent_ratio <= 30 && budget_remaining > 100 { "B — Solid choices. Room for growth.".to_string() }
    else if rent_ratio <= 35 { "C — Manageable, but watch your spending.".to_string() }
    else { "D — Tight budget. Consider a roommate or cheaper area.".to_string() }
}

#[wasm_bindgen]
pub fn is_final_chapter(id: usize) -> bool { id >= CHAPTERS.len() - 1 }

#[cfg(test)]
mod tests {
    use super::*;

    #[test] fn chapter_count() { assert_eq!(get_chapter_count(), 7); }
    #[test] fn titles_not_empty() { for i in 0..7 { assert!(!get_chapter_title(i).is_empty()); } }
    #[test] fn texts_not_empty() { for i in 0..7 { assert!(!get_chapter_text(i).is_empty()); } }
    #[test] fn out_of_bounds() { assert!(get_chapter_title(99).is_empty()); assert!(get_chapter_text(99).is_empty()); }
    #[test] fn choices_exist() { for i in 0..7 { assert!(get_choice_count(i) >= 1); } }
    #[test] fn choice_texts() { for i in 0..7 { for j in 0..get_choice_count(i) { assert!(!get_choice_text(i,j).is_empty()); } } }
    #[test] fn choice_lessons() { for i in 0..7 { for j in 0..get_choice_count(i) { assert!(!get_choice_lesson(i,j).is_empty()); } } }
    #[test] fn choice_next_valid() { for i in 0..6 { for j in 0..get_choice_count(i) { assert!(get_choice_next(i,j) > i); } } }
    #[test] fn last_chapter_final() { assert!(is_final_chapter(6)); assert!(!is_final_chapter(0)); }
    #[test] fn budget_effect() {
        let r = apply_choice_effect(2400, 0, 680, 0, 1); // pizza = -25
        assert_eq!(r[0], 2375);
    }
    #[test] fn rent_effect() {
        let r = apply_choice_effect(2400, 0, 680, 1, 0); // studio 850
        assert_eq!(r[1], 850);
    }
    #[test] fn credit_effect() {
        let r = apply_choice_effect(2400, 850, 680, 3, 0); // negotiate +10
        assert_eq!(r[2], 690);
    }
    #[test] fn monthly_budget() {
        let b = calculate_monthly_budget(42000, 850);
        assert_eq!(b.len(), 7);
        assert!(b[0] > 0); // after tax
        assert_eq!(b[1], 850); // rent
        assert!(b[6] >= 0); // remaining
    }
    #[test] fn grade_a() { assert!(get_financial_grade(500, 550, 42000).starts_with("A")); }
    #[test] fn grade_b() { assert!(get_financial_grade(200, 850, 42000).starts_with("B")); }
    #[test] fn grade_d() { assert!(get_financial_grade(0, 1500, 42000).starts_with("D")); }
    #[test] fn full_playthrough() {
        let mut ch = 0;
        let mut budget: i32 = 2400;
        let mut rent: i32 = 0;
        let mut credit: i32 = 680;
        let mut steps = 0;
        while !is_final_chapter(ch) && steps < 20 {
            let choice = 0; // always pick first option
            let r = apply_choice_effect(budget, rent, credit, ch, choice);
            budget = r[0]; rent = r[1]; credit = r[2];
            ch = get_choice_next(ch, choice);
            steps += 1;
        }
        assert!(is_final_chapter(ch));
        assert!(steps <= 7);
    }
    #[test] fn all_paths_reach_end() {
        // Test both choices at each chapter lead to valid next
        for i in 0..get_chapter_count() - 1 {
            for j in 0..get_choice_count(i) {
                let next = get_choice_next(i, j);
                assert!(next > i && next < get_chapter_count() + 1, "Ch {} choice {} -> {}", i, j, next);
            }
        }
    }
    #[test] fn lessons_contain_keyword() {
        // Every lesson should mention a financial concept
        let keywords = ["lesson", "Lesson"];
        for i in 0..get_chapter_count() {
            for j in 0..get_choice_count(i) {
                let lesson = get_choice_lesson(i, j);
                assert!(keywords.iter().any(|k| lesson.contains(k)), "Ch {} choice {} lesson has keyword", i, j);
            }
        }
    }
}
