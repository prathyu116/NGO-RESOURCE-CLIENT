# NGO Resource Tracker

A web application designed to help Non-Governmental Organizations (NGOs) manage essential resources like inventory, donors, and logistics efficiently. Built with React, Redux Toolkit, and React Bootstrap.

## Overview

This project provides a centralized dashboard for NGO administrators to track incoming donations, manage inventory levels, record donor information, and organize the distribution of goods through a logistics module. It utilizes a mock backend (`json-server`) for development and demonstration purposes.

## Features

*   **User Authentication:** Secure login/logout for administrators.
*   **Dashboard Layout:** Consistent navigation structure with main and sub-navigation bars.
*   **Inventory Management:**
    *   View current inventory stock (Item Name, Category, Quantity).
    *   Add new inventory items (handled automatically via Donations).
    *   Edit existing inventory item details (Name, Category, Quantity).
    *   Delete inventory items.
    *   View donors associated with a specific inventory item.
*   **Donor Management:**
    *   Add new donors along with their initial donation details (updates inventory).
    *   View a list of all donors (Individuals/Organizations).
    *   Edit donor contact details.
    *   Delete donors.
    *   View detailed donation history for a specific donor.
*   **Logistics & Distribution:**
    *   Create shipment records, selecting items directly from available inventory.
    *   Automatically deducts shipped quantity from inventory stock.
    *   View a list of all shipments (Destination, Item, Quantity, Status).
    *   Update the delivery status of shipments (Pending, Shipped, Delivered, Cancelled).
*   **State Management:** Centralized state management using Redux Toolkit for scalability and predictability.
*   **Routing:** Protected routes ensuring only logged-in users can access the dashboard features.
*   **UI:** Responsive user interface built with React Bootstrap.

## Technologies Used

*   **Frontend:**
    *   React (`v18+`)
    *   React Router DOM (`v6+`)
    *   Redux Toolkit
    *   React-Redux
    *   React Bootstrap
    *   Bootstrap (`v5+`)
    *   Axios
    *   React Icons
*   **Backend (Mock):**
    *   `json-server`
*   **State Management:**
    *   Redux Toolkit
*   **Styling:**
    *   React Bootstrap & Bootstrap CSS

## Prerequisites

*   Node.js (v16 or later recommended)
*   npm (v8 or later) or yarn

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd ngo-tracker
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application

This project requires two separate terminal processes to run concurrently: the mock backend (`json-server`) and the React development server.

1.  **Run the Mock Backend:**
    Open a terminal in the project root directory and run:
    ```bash
    npx json-server --watch db.json --port 5001
    ```
    *   This command uses `npx` to run `json-server` without needing a global installation.
    *   It watches the `db.json` file for changes and serves a REST API on port `5001`.
    *   **Keep this terminal running.**

2.  **Run the React Development Server:**
    Open a *second* terminal in the project root directory and run:
    ```bash
    npm start
    # or
    yarn start
    ```
    *   This will start the React development server, usually on `http://localhost:3000`.
    *   Your browser should automatically open to the application.

## Login Credentials

Use the following credentials to log in (defined in `db.json`):

*   **Email:** `admin@ngo.com`
*   **Password:** `password123`

## Project Structure