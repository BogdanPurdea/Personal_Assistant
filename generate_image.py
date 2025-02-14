from langchain_openai import OpenAI
from langchain_community.utilities.dalle_image_generator import DallEAPIWrapper
from dotenv import load_dotenv
import os
import requests
from PIL import Image
from io import BytesIO
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

os.environ["OPENAI_API_KEY"]= os.getenv('VITE_OPENAI_API_KEY')
llm = OpenAI(temperature=0.9)
image_generator = DallEAPIWrapper()

# Create a directory for saving images if it doesn't exist
save_dir = "assets/generated_images"
if not os.path.exists(save_dir):
    os.makedirs(save_dir)

# Direct Image Generation
image_url = image_generator.run("A colorful and creative user profile placeholder picture.")
# Download the image from URL
response = requests.get(image_url)
img = Image.open(BytesIO(response.content))

# Generate a filename with timestamp to avoid overwrites
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
filename = f"generated_image_{timestamp}.png"
save_path = os.path.join(save_dir, filename)
# Save the image
img.save(save_path)
print(f"Image saved as: {save_path}")