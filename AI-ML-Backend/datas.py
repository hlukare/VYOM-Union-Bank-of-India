import requests
from PIL import Image
from io import BytesIO

# Hugging Face API token
api_token = "replace-with-your-api-key"  # Replace with your Hugging Face API token

# Define the URL for the Hugging Face Inference API
url = "place-url-here"

# Define headers for authentication
headers = {
    "Authorization": f"Bearer {api_token}"
}

def generate_image(prompt):
    try:
        # Define the payload for the API request
        data = {
            "inputs": prompt
        }

        # Make the POST request to the Hugging Face API
        response = requests.post(url, headers=headers, json=data)

        # Check if the response is successful
        if response.status_code == 200:
            # Get the generated image from the response content
            image = Image.open(BytesIO(response.content))
            return image
        else:
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    prompt = "A futuristic scientific world where highly advanced robots are the main characters. The environment is a sprawling city filled with towering skyscrapers made of glass and metal, illuminated by neon lights and holographic displays. The robots, designed with intricate mechanical details, display human-like intelligence and emotions, engaging in various scientific activities such as research, innovation, and technological advancements. Some robots are seen analyzing data on floating holographic screens, while others operate high-tech machinery in futuristic laboratories. The sky is a blend of deep blue and purple hues, with flying vehicles and drones moving between towering structures. The atmosphere is a perfect blend of science fiction and realism, showcasing a world where AI and robotics have become the pioneers of knowledge and progress."
    image = generate_image(prompt)

    if isinstance(image, Image.Image):
        image.show()  # Open the image in the default image viewer
        image.save("generated_image.png")  # Save the image to a file
        print("Image generated and saved successfully!")
    else:
        print(f"Error: {image}")
