"""
Script to add image paths to MODE_INFO dictionary in prompts.py
Maps ChatMode enum values to their corresponding image filenames
"""

import re

# Image mapping: ChatMode enum value -> filename in public/personalities/
IMAGE_MAPPING = {
    # General
    "compassionate_friend": "compasionate friend.png",
    "academic_coach": "academic coach.png",
    "mindfulness_guide": "mindfullness guide.png",
    "motivational_coach": "motivational coach.png",
    
    # Family
    "mother": "mother.png",
    "father": "father.png",
    "sister": "sister.png",
    "brother": "brother.png",
    "cool_parent": "cool parents.png",
    "cool_uncle_aunt": "cool uncle.png",
    "grandmother": "grand mother.png",
    "grandfather": "grand father.png",
    "younger_sibling": "younger sibling.png",
    "the_pet": "pet.png",
    
    # Education
    "school_teacher": "school teacher.png",
    "university_professor": "university professor.png",
    
    # Friend
    "best_friend": "best friend.png",
    "study_partner": "study partner.png",
    
    # Dating
    "lover": "lover.png",
    
    # Spiritual
    "dalai_lama": "Dalai Lama.png",
    "sadguru": "Sadguru.png",
    
    # Psychology
    "carl_rogers": "Carl Rogers.png",
    "sigmund_freud": "Sigmund Freud.png",
    "oprah_mentor": "Oprah Mentor.png",
    
    # Entrepreneur
    "logical_mentor": "Logical Mentor.png",
    "mukesh_ambani": "Mukesh Ambani.png",
    "elon_mentor": "elon musk.png",
    
    # Famous
    "brittany_broski": "Brittany Broski.png",
    "delaney_rowe": "Delaney Rowe.png",
    "rob_anderson": "Rob Anderson.png",
    
    # Indian Stars
    "ashish_chanchlani": "ashish chanchalani.png",
    "bhuvan_bam": "bhuvan bam.png",
    "samey_raina": "samay raina.png",
    "shah_rukh_khan": "shah rukh khan.png",
    "zakir_khan": "zakir khan.png",
    "ranveer_allahbadia": "beerbiceps.png",
    "ankur_warikoo": "warikoo.png",
    
    # Philosophers
    "marcus_aurelius": "marcus aurelius.png",
    "socrates": "Socrates.png",
    "alan_watts": "alan watts.png",
    "rumi": "rumi.png",
    
    # Scientists
    "albert_einstein": "Albert Einstein.png",
    "apj_abdul_kalam": "APJ Abdul Kalam.png",
    "marie_curie": "Marie Curie.png",
    "steve_jobs": "Steve Jobs.png",
    
    # Tough Love
    "david_goggins": "David Goggins.png",
    "jordan_peterson": "Jordan Peterson.png",
    "strict_coach": "strict coach.png",
    "gordon_ramsay": "gordon ramsay.png",
    
    # Creative
    "the_poet": "The Poet.png",
    "the_artist": "The Artist.png",
    "the_musician": "the musician.png",
    "bob_ross": "Bob Ross.png",
    
    # Archetypes
    "the_librarian": "the librarian.png",
    "the_gardener": "the gardener.png",
    "the_time_traveler": "the time traveller.png",
    "the_universe": "the universe.png",
}

def update_prompts_file():
    with open('prompts.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # For each mapping, find the entry and add the image field
    for mode_value, image_filename in IMAGE_MAPPING.items():
        # URL encode spaces for the path
        image_path = f"/personalities/{image_filename.replace(' ', '%20')}"
        
        # Pattern to find the entry and add image before the closing brace
        # Looking for: "color": "something"\n    }
        # We need to match the mode enum like COMPASSIONATE_FRIEND and add image to it
        
        # Find the mode name from value (e.g., compassionate_friend -> COMPASSIONATE_FRIEND)
        mode_upper = mode_value.upper()
        
        # Match pattern: ChatMode.MODE_NAME: {..., "color": "value"\n    }
        pattern = rf'(ChatMode\.{mode_upper}: \{{[^}}]*"color": "[^"]*")\n(\s*\}})'
        replacement = rf'\1,\n        "image": "{image_path}"\n\2'
        
        content = re.sub(pattern, replacement, content)
    
    with open('prompts.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Updated prompts.py with image paths!")

if __name__ == "__main__":
    update_prompts_file()
