# Bella Ciao Data Collection

A responsive, high-aesthetic customer feedback and data collection application themed after "Money Heist" (Bella Ciao). This project features a clean White & Red "Pop" design, fluid animations, and a comprehensive Admin Dashboard.

## 🎨 Features

- **Thematic UI**: "Money Heist" inspired design with a professional White & Black palette and Netflix Red accents.
- **Feedback System**: 5-Star rating with interactive tags (Great Food, Cool Vibe, etc.) and open feedback text area.
- **Animations**: Fluid entrance and success animations using `framer-motion`.
- **Mobile First**: Optimized layout for all devices.
- **Admin Dashboard**: Secure panel to view, search, filter, and export data.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- A PostgreSQL database (e.g., Neon, Supabase)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Rrayan0001/Data_Collection_BellaCiao.git
    cd Data_Collection_BellaCiao
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add:
    ```env
    DATABASE_URL="your_postgresql_connection_string"
    ADMIN_PASS="bella123" # Set your desired admin password
    ```

4.  **Sync Database**:
    ```bash
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) (or the port specified) to view the app.

## 🔐 Admin Access

- **URL**: `/admin-login`
- **Default Password**: `bella123` (Change this in `.env`)

The Admin Dashboard allows you to:
- View all guest entries.
- Search by Name or Phone.
- Filter by Date (Today, This Week).
- Export data to CSV.

## 📂 Project Structure

- `app/page.tsx`: Main customer data collection form.
- `app/admin/`: Protected admin dashboard.
- `app/api/`: API routes for submission, auth, and data retrieval.
- `prisma/schema.prisma`: Database schema definition.

## 📄 License

All rights reserved to Bella Ciao Restaurant.
Powered by Margros.
