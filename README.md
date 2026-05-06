🏎️ TurboFlow: Hot Wheels Shop POS System
TurboFlow is a modern Point of Sale (POS) application designed specifically for a Hot Wheels retail environment. The project demonstrates a robust full-stack implementation using Express.js and MongoDB, fully containerized with Docker for seamless deployment.

🚀 Key Features
Full CRUD Operations: Efficiently manage Hot Wheels inventory with Create, Read, Update, and Delete functionalities.

Stateless Backend: Built using Express.js to ensure a scalable and high-performance server environment.

Persistent Storage: Integrated with MongoDB for flexible and reliable data management of toy car inventory.

Dockerized Environment: Includes a docker-compose.yml file to orchestrate both the application and the database services with a single command.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (housed in the /public directory).

Backend: Node.js with Express.js framework.

Database: MongoDB.

Containerization: Docker & Docker Compose.

📂 Project Structure
public/: Contains the frontend assets including index.html, style.css, and script.js.

index.js: The main entry point for the Express server and API logic.

docker-compose.yml: Configuration for running the app and MongoDB in containers.

package.json: Manages project dependencies and scripts.

🚦 Getting Started
To run this project locally using Docker, simply follow these steps:

Clone the repository.

Ensure Docker Desktop is running.

Run the following command in your terminal:

Bash
docker-compose up --build
Access the application at http://localhost:[YourPort]
