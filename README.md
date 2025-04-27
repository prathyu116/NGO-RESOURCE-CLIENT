# NGO Resource Tracker

A web application designed to help Non-Governmental Organizations (NGOs) manage essential resources like inventory, donors, and logistics efficiently. Built with React, Redux Toolkit, and React Bootstrap.



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
    *  nodejs + express
    *  mongodb
*   **State Management:**
    *   Redux Toolkit
*   **Styling:**
    *   React Bootstrap & Bootstrap CSS



