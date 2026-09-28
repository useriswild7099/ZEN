from unsloth import FastLanguageModel
import torch
from trl import SFTTrainer
from transformers import TrainingArguments
from datasets import Dataset
import json
import os

def train():
    print("Loading Gemma 3 4B Model (Optimized)...")
    # 1. Load Gemma 3 4B Model (Optimized)
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "unsloth/gemma-3-4b-it-bnb-4bit",
        max_seq_length = 2048,
        load_in_4bit = True,
    )

    # 2. Add LoRA Adapters
    model = FastLanguageModel.get_peft_model(
        model,
        r = 16,
        target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_alpha = 16,
        lora_dropout = 0,
        bias = "none",
    )

    # 3. Format the Dataset
    prompt_style = """Below is an anonymous journal entry from a student. Analyze the emotional intensity and provide a supportive, non-diagnostic response.

### Journal Entry:
{}

### AI Supportive Guidance:
{}"""

    # Load dataset
    if not os.path.exists("dataset.json"):
        print("Error: dataset.json not found. Run generate_dataset.py first.")
        return

    with open("dataset.json", "r") as f:
        dataset_list = json.load(f)

    formatted_data = [prompt_style.format(item['User Input'], item['AI Response']) for item in dataset_list]
    dataset = Dataset.from_dict({"text": formatted_data})

    print(f"Starting training with {len(dataset)} examples...")

    # 4. Set Training Arguments (Fast Training Mode)
    trainer = SFTTrainer(
        model = model,
        tokenizer = tokenizer,
        train_dataset = dataset,
        dataset_text_field = "text",
        max_seq_length = 2048,
        args = TrainingArguments(
            per_device_train_batch_size = 2,
            gradient_accumulation_steps = 4,
            warmup_steps = 5,
            max_steps = 60, # Fast training for 100 examples
            learning_rate = 2e-4,
            fp16 = not torch.cuda.is_supported(),
            bf16 = torch.cuda.is_supported(),
            logging_steps = 1,
            output_dir = "outputs",
            optim = "adamw_8bit",
        ),
    )

    # 5. Train and Save
    trainer.train()
    
    print("Saving fine-tuned model to 'soul_sync_lora'...")
    model.save_pretrained_lora("soul_sync_lora")
    tokenizer.save_pretrained("soul_sync_lora")
    print("Training complete! Model saved to 'soul_sync_lora'.")

if __name__ == "__main__":
    train()
