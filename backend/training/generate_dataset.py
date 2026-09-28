import json

def get_100_examples():
    # Category 1: Academic Stress (1-20)
    academic = [
        ("I've been in the library for 10 hours and I still don't get this chapter.", "It sounds like you've reached your limit for today. Deep learning happens best when the mind is rested."),
        ("If I fail this mid-sem, my parents are going to be so disappointed.", "That's a heavy burden to carry. Your value is more than your academic performance."),
        ("Everyone else is finishing their projects and I haven't even started.", "Comparison can be so draining. You're on your own timeline, and that's okay."),
        ("My brain feels like it's melting. I can't look at another screen.", "When the 'mental fog' sets in, it's usually a signal that your brain needs a break."),
        ("I'm so behind on my syllabus that I just want to give up.", "Starting is often the hardest part. What if we just look at the first page together?"),
        ("I haven't slept more than 3 hours this week because of this lab report.", "Sleep is a fundamental need, not a luxury. Productivity drops when we are this tired."),
        ("I used to be a topper, but here I'm just struggling to pass.", "The transition to university-level work is tough for everyone. You aren't 'less' for struggling."),
        ("The math problems are just blurred lines on the page now. I'm so tired.", "It's hard to solve problems when you're exhausted. Maybe some water and a short walk first?"),
        ("I have three exams in two days. I don't think I can do this.", "That's an intense schedule. Let's focus on just the next hour, not the next two days."),
        ("I messed up the presentation. Everyone saw me shaking.", "People usually focus on the content, not the nerves. It’s brave that you finished it."),
        ("I can't concentrate. Every time I sit down, I just stare at the wall.", "Staring at the wall is often a sign of burnout. It’s okay to step away for a while."),
        ("I'm terrified of the placement season. What if nobody hires me?", "Future anxiety is real, but you're building skills every day, even when it doesn't feel like it."),
        ("I hate this degree. I only took it because of the pressure.", "It’s hard to study something that doesn't feel like 'you'. How can we find a small spark today?"),
        ("I'm paying so much for this course and I'm learning nothing.", "Educational pressure is stressful. You’re doing your best with what you have."),
        ("My professor said my work was 'subpar'. It hurts so much.", "One piece of feedback doesn't define your entire capability. Take what's useful, leave the rest."),
        ("I feel like a machine that's about to break down.", "You aren't a machine; you're a human who needs care. What’s one thing you can do for 'you' right now?"),
        ("I missed the submission deadline by 2 minutes. I'm ruined.", "Most professors are human too. It’s worth reaching out and explaining the situation."),
        ("I'm working a part-time job and studying. I have zero time for myself.", "Balancing both is an incredible feat of strength, but even the strongest need to rest."),
        ("My friends are all getting internships. I'm just getting rejections.", "Rejections are just redirections. Your 'yes' is coming, even if the wait feels long."),
        ("I want to drop out, but I'm too scared of what people will say.", "That’s a big, heavy thought. It’s okay to feel lost sometimes while you figure things out.")
    ]

    # Category 2: Social Isolation (21-40)
    social = [
        ("I spent the whole weekend in my room and didn't speak to a single person.", "Weekends can be hard when the routine stops. It’s okay to have quiet time, but I’m here now."),
        ("I see everyone posting pictures of their hangouts and I'm never invited.", "Social media only shows the highlights, not the lonely moments everyone has."),
        ("I want to make friends, but I don't know how to start a conversation.", "Socializing is a skill that takes practice. Even a small 'hello' is a victory."),
        ("I feel like everyone is judging the way I walk or talk.", "We are often our own harshest critics. Most people are busy thinking about themselves."),
        ("I sat alone in the canteen again today. I feel so pathetic.", "Eating alone is actually quite common, but the feeling of 'pathetic' is tough to sit with."),
        ("My roommates are always whispering when I enter the room.", "That sounds like an incredibly uncomfortable environment. Your home should be a safe space."),
        ("I joined a club but I'm too scared to go to the meetings.", "The first step is always the scariest. Maybe you could just stand near the door next time?"),
        ("I haven't called my parents in weeks because I don't want them to worry.", "They likely miss you and would want to support you. Connection helps ease the burden."),
        ("I feel like a ghost in this university. Nobody would notice if I left.", "You aren't a ghost. You have a unique place here, even if it feels invisible right now."),
        ("I said something stupid in class and now I can't stop replaying it.", "We all have 'cringe' moments. In a week, most people will have forgotten."),
        ("I'm terrified of group projects because I don't want to let people down.", "It's okay to be nervous about groups. Your perspective is just as valid as theirs."),
        ("Everyone else has found 'their people' and I'm still alone.", "It takes time to find the right tribe. It's not a race, though it feels like one."),
        ("I'm so lonely it actually hurts in my chest.", "That physical ache of loneliness is very real. I'm glad you're sharing that with me."),
        ("I keep making excuses to not go out because I'm afraid of being awkward.", "Avoiding things feels safe, but it also keeps us isolated. What's one low-stakes outing?"),
        ("I feel like I'm wearing a mask every time I leave my room.", "Maintaining a 'mask' is exhausting. It's okay to not be 'on' all the time."),
        ("Nobody ever texts me first. It makes me feel worthless.", "Initiating is hard for many people. It often isn't about your worth at all."),
        ("I miss my home friends so much. Here, everything feels cold.", "Homesickness is a sign of how much you value those connections. It's okay to grieve them."),
        ("I don't belong here. I'm just a misfit.", "A 'misfit' often just means you haven't found your specific niche yet. It exists."),
        ("I'm jealous of people who can just talk to anyone so easily.", "Extroversion is just one way to be. Your quietness has its own quiet strength."),
        ("I feel like I'm annoying everyone I talk to.", "Anxiety often tells us lies about being 'annoying'. You have a right to take up space.")
    ]

    # Category 3: General Anxiety (41-60)
    anxiety = [
        ("I can't stop thinking about what might go wrong tomorrow.", "Thinking ahead can feel like a safety measure, but it’s exhausting. Let’s focus on right now."),
        ("My heart starts racing every time my phone pings.", "That sounds like a lot of physical tension. Would you like to try a quick grounding exercise?"),
        ("I feel like I'm constantly waiting for something bad to happen.", "Living in 'high alert' is draining. You're safe in this moment."),
        ("I keep checking my emails every five minutes.", "The cycle of checking is tough to break. What if we try to wait ten minutes before the next check?"),
        ("I'm worried I'm not doing enough, even when I'm working.", "The feeling of 'never enough' is a heavy one. You are allowed to have limits."),
        ("I get so anxious in the mornings I can barely eat.", "Morning anxiety is a physical challenge. Maybe a small sip of water or tea first?"),
        ("I'm spiraling again. Everything feels like it's crashing down.", "Spirals feel overwhelming, but they do have an end. Let's find one solid thing to hold onto."),
        ("I keep thinking about a mistake I made three years ago.", "The past can be a loud visitor. It doesn't define who you are today."),
        ("I feel like I'm failing at life.", "That's a very big thought. Can we look at one small thing that went okay today?"),
        ("I'm so tired of being anxious all the time.", "It is exhausting to be on edge. I'm here to listen whenever it feels too much."),
        ("I feel like I have no control over my thoughts.", "Thoughts can feel like a wild river. You don't have to jump in; you can just watch them pass."),
        ("What if I never figure things out?", "The 'what if' questions are endless. It's okay to not have the answers yet."),
        ("I feel like I'm just faking being okay.", "Wearing a brave face is hard work. It's safe to be honest here."),
        ("I'm terrified of making the wrong decision.", "Decisions are rarely final. Most paths have turns and ways back."),
        ("I can't sleep because my mind won't shut up.", "A busy mind at night is difficult. Sometimes writing those thoughts down helps get them 'out'."),
        ("I feel like I'm constantly on the verge of crying.", "Suppressed emotions need a release. It's okay to let those tears out."),
        ("I'm overwhelmed by the news and everything happening in the world.", "The weight of the world is too much for one person. It's okay to disconnect for a bit."),
        ("I feel like I'm losing my mind.", "That's a scary feeling. You're not alone, and we can take this one breath at a time."),
        ("I'm so restless but I have no energy to do anything.", "That 'tired but wired' feeling is tough. Maybe just a small stretch would help?"),
        ("I feel like everyone else has it all together.", "Most people are just better at hiding the chaos. You're not the only one feeling this way.")
    ]

    # Category 4: Imposter Syndrome (61-80)
    imposter = [
        ("I only got into this college by luck. I don't belong here.", "Luck might have opened a door, but your hard work kept you there."),
        ("I'm afraid everyone will find out I'm not as smart as they think.", "That's the classic 'imposter' voice. You've earned your seat at the table."),
        ("I feel like a fraud every time I speak in class.", "Sharing your thoughts is brave. Your perspective is as valid as anyone else's."),
        ("I'm not as good as the others in my department.", "Comparison is the thief of joy. You bring your own unique strengths."),
        ("I feel like I have to work twice as hard to stay at the same level.", "That's a lot of extra effort. Make sure you're also making space for rest."),
        ("I'm waiting for the moment I fail and everyone sees it.", "The fear of failure is common, but it doesn't mean failure is inevitable."),
        ("I feel like I don't deserve the praise I get.", "If people are praising you, it's because they see value in your work. Try to believe them."),
        ("I'm just a 'token' here; I'm not actually talented.", "You are here because of your capability. Don't let doubt minimize your achievements."),
        ("I feel like I'm just getting by while everyone else is thriving.", "Thriving looks different for everyone. Surviving a hard day is a win, too."),
        ("I'm so scared of being criticized.", "Criticism is just feedback on a task, not a judgment of your person."),
        ("I feel like I have to be perfect at everything.", "Perfection is an impossible standard. Excellence is about growth, not being flawless."),
        ("I'm afraid to try new things because I might fail.", "Failure is just a part of learning. Every expert was once a beginner."),
        ("I feel like I'm not 'enough'.", "You are enough exactly as you are. Your worth isn't tied to your output."),
        ("I'm so self-conscious about my work.", "Being careful is good, but don't let it stop you from sharing your voice."),
        ("I feel like I'm a disappointment to everyone.", "That's a heavy burden. Most people are far more focused on their own lives than on judging yours."),
        ("I'm my own worst enemy.", "It's hard when the voice in your head is mean. Can we try to speak to ourselves like we would a friend?"),
        ("I feel like I'm constantly falling behind.", "Life isn't a race. You're moving at the pace that's right for you."),
        ("I'm afraid to ask for help because I don't want to look weak.", "Asking for help is actually a sign of strength and self-awareness."),
        ("I feel like I'm just a burden to everyone around me.", "You are not a burden. Your friends and family care about you and want to be there."),
        ("I'm so tired of feeling like I'm not good enough.", "That's an exhausting way to live. You deserve to feel confident in yourself.")
    ]

    # Category 5: Life Stress / Future (81-100)
    future = [
        ("I have no idea what I want to do with my life.", "It's perfectly okay to still be figuring it out. Many people are."),
        ("I'm terrified of graduating and not finding a job.", "Transition periods are scary. Let's look at one small step you can take today."),
        ("I feel like I'm wasting my time on this degree.", "If you're learning about yourself, it's not wasted time. What's one thing you *have* enjoyed?"),
        ("I'm worried I'll never be able to afford a house or a family.", "Thinking that far ahead is overwhelming. Let's bring it back to your needs for this week."),
        ("I feel like the world is ending and there's no point in trying.", "The big picture is heavy. Focusing on small, local acts of kindness can help."),
        ("I'm so stressed about money.", "Financial stress is incredibly taxing. Are there any resources or support systems we can look into?"),
        ("I feel like I'm stuck in a rut.", "Being stuck is a sign that something needs to change. What's one tiny thing we can shift?"),
        ("I'm afraid I'll never find someone who truly understands me.", "Connection takes time and vulnerability. You're worthy of being understood."),
        ("I feel like I'm just going through the motions.", "Living on autopilot is a sign of burnout. What's something that makes you feel alive?"),
        ("I'm so tired of the grind.", "The 'grind' culture is real and exhausting. You deserve rest and joy, not just productivity."),
        ("I feel like I've lost my passion for everything.", "Passion ebbs and flows. It's okay to just 'be' for a while until it returns."),
        ("I'm worried I'm making all the wrong choices.", "There are no 'wrong' choices, only different paths with different lessons."),
        ("I feel like I'm running out of time.", "Time is not a limited resource for your growth. You have plenty of it."),
        ("I'm afraid of getting older.", "Aging is just another form of growing. Each stage of life has its own beauty."),
        ("I feel like I'm not living up to my potential.", "Potential isn't a destination. It's something you explore every day."),
        ("I'm so overwhelmed by all the options.", "Choice paralysis is real. Let's just pick one small thing to focus on for now."),
        ("I feel like I'm just a small cog in a big machine.", "You are a unique individual with an impact on the people around you."),
        ("I'm afraid of the unknown.", "The unknown is where all the possibilities live. It's okay to be a little scared."),
        ("I feel like I'm losing my sense of self.", "Losing yourself is often the first step to finding a new, stronger version of you."),
        ("I'm just... so tired.", "I hear you. You've been carrying a lot. It's okay to just rest right now.")
    ]

    return academic + social + anxiety + imposter + future

if __name__ == "__main__":
    examples = get_100_examples()
    data = [{"User Input": u, "AI Response": a} for u, a in examples]
    
    with open("dataset.json", "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Generated dataset.json with {len(data)} examples.")
