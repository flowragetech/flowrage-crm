<p align="center">
<h1 align="center">Flowrage Admin Panel</h1>

<div align="center">White-labeled admin panel for Flowrage SEO Agency, built with Next.js 16, Tailwind CSS & Shadcn UI.</div>
<div align="center"><strong>Production Domain: <a href="https://admin.flowrage.com">admin.flowrage.com</a></strong></div>


<br />
<div align="center">
  <strong>Flowrage SEO Agency Admin System</strong>
</div>
<br />

## Overview

This is an **admin dashboard starter template** built with **Next.js 16, Shadcn UI, and Tailwind CSS**.

It gives you a production-ready **dashboard UI** with authentication, charts, tables, forms, and a feature-based folder structure, perfect for **SaaS apps, internal tools, and admin panels**.

### Tech Stack

This template uses the following stack:

- Framework - [Next.js 16](https://nextjs.org/16)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - Custom Auth (Next.js)
- Error tracking - [Sentry](https://sentry.io)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice table](https://www.diceui.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

_If you are looking for more information about this project, please contact the Flowrage development team._

## Features

- 🧱 Pre-built **admin dashboard layout** (sidebar, header, content area)

- 📊 **Analytics overview** page with cards and charts

- 📋 **Data tables** with server-side search, filter & pagination

- 🔐 **Authentication** & user management

- 🏢 **Multi-tenant workspaces** (create, switch, manage teams)

- 💳 **Billing & subscriptions** (plan management, feature gating)


- 🔒 **RBAC navigation system** - Fully client-side navigation filtering based on organization, permissions, and roles

- ℹ️ **Infobar component** to show helpful tips, status messages, or contextual info on any page

- 🧩 **Shadcn UI components** with Tailwind CSS styling

- 🧠 Feature-based folder structure for scalable projects

- ⚙️ Ready for **SaaS dashboards**, internal tools, and client admin panels

## Use Cases

You can use this Next.js + Shadcn UI dashboard starter to build:

- SaaS admin dashboards

- Internal tools & operations panels

- Analytics dashboards

- Client project admin panels

- Boilerplate for new Next.js admin UI projects

## Pages

| Pages                                                                                                                                                                  | Specifications                                                                                                                                                                                                                                                          |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Signup / Signin                                                                                                                                                      | Authentication with custom implementation provides secure authentication and user management. |
| Dashboard Overview                                                                                                                                                | Cards with Recharts graphs for analytics. Parallel routes in the overview sections feature independent loading, error handling, and isolated component rendering.                                                                                                       |
| Product List (Table)                                                                                                                                                    | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                                                                                                                                       |
| Create Product Form                                                                                                                                                 | A Product Form with shadcn form (react-hook-form + zod).                                                                                                                                                                                                                |
| Profile                                                                                                                                                                 | Account management UI that allows users to manage their profile and security settings                                                                                                                                                             |
| Kanban Board                                                                                                                                                            | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                                                                                                                                  |
| Workspaces                                                                                                                                                           | Organization management page. Users can view, create, and switch between organizations/workspaces.                                                                                                                       |
| Team Management                                                                                                                                                 | Full-featured team management interface. Manage members, roles, permissions, security settings, and organization details. Requires an active organization.                                                            |
| Billing & Plans                                                                                                                                                         | Billing management page. Organizations can view available plans, subscribe, and manage subscriptions. Requires an active organization.                                                                                       |
| Exclusive Page                                                                                                                                                        | Example of plan-based access control. This page is only accessible to organizations on the Pro plan, demonstrating feature gating with fallback UI.                                                                                 |
| Not Found                                                                                                                                                              | Not Found Page Added in the root level                                                                                                                                                                                                                                  |
| Global Error | A centralized error page that captures and displays errors across the application. Integrated with **Sentry** to log errors, provide detailed reports, and enable replay functionality for better debugging. |

## Feature based organization

```plaintext
src
├── app
│   ├── (auth)
│   ├── (dashboard)
│   ├── api
│   └── layout.tsx
├── components
│   ├── layouts
│   ├── ui
│   └── ...
├── lib
├── hooks
└── ...
```

---

# Flowrage Admin - DevOps & Deployment Guide

This document provides a complete guide to setting up the server environment and deploying the Flowrage Admin Panel using the automated CI/CD pipelines.

## 1. Log in to Your VPS

First, connect to your server using SSH. You will need your server's IP address and the login user (e.g., `root`).

```bash
ssh <your_username>@<your_vps_ip>
# Example:
# ssh root@164.68.123.79
```

## 2. Create Application Folders

Create separate directories on your server to hold the deployment files for the frontend and admin applications. The CI/CD pipeline is configured to use these specific paths.

```bash
# For the admin panel
mkdir -p /var/www/flowrage/flowrage-admin-panel

# For the frontend (if applicable)
mkdir -p /var/www/flowrage/flowrage-frontend
```

## 3. Generate and Configure SSH Keys for Deployment

To allow GitHub Actions to securely connect to your server, you need to generate an SSH key pair on the server.

**Steps:**

1.  **Generate the Key Pair**: Run the following command on your server. Replace the email with your own.
    ```bash
    # Press Enter to accept the default file location and to set no passphrase.
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    ```

2.  **Authorize the Public Key**: Add the newly created public key to the `authorized_keys` file. This allows the corresponding private key to be used for login.
    ```bash
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    ```

3.  **Retrieve the Private Key**: Display the private key. You will need to copy this entire key to use in GitHub Secrets.
    ```bash
    # Keep this key secure and do not expose it publicly.
    cat ~/.ssh/id_rsa
    ```
    Copy the entire output, including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`.

## 4. Set Up GitHub Secrets

In your GitHub repository, navigate to `Settings` > `Secrets and variables` > `Actions`. Create the following repository secrets. These are required for the CI/CD pipeline to run successfully.

| Secret Name | Description | Example Value |
| --- | --- | --- |
| `VPS_IP` | The IP address of your deployment server. | `164.68.123.79` |
| `VPS_USERNAME` | The username to log in to your server. | `root` |
| `VPS_SSH_KEY` | The private SSH key you generated in Step 3. | `-----BEGIN...KEY-----...` |
| `VPS_PORT` | The SSH port for your server (usually 22). | `22` |
| `DB_USER` | PostgreSQL username. | `postgres` |
| `DB_PASSWORD` | PostgreSQL password. | `secure_password` |
| `DB_NAME` | Database name. | `flowrage_admin` |
| `AUTH_SECRET` | Secret key for NextAuth/Auth.js. | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Full URL of the admin panel. | `https://admin.flowrage.com` |
| `SMTP_HOST` | Email server host. | `smtp.zoho.com` |
| `SMTP_PORT` | Email server port. | `465` |
| `SMTP_USER` | Email username. | `admin@flowrage.com` |
| `SMTP_PASSWORD` | Email password. | `*******` |
| `SMTP_FROM` | Default sender email. | `Flowrage Admin <admin@flowrage.com>` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking. | `https://...@sentry.io/...` |

**Note**: The workflow is configured to use the GitHub Container Registry (`ghcr.io`), which uses a temporary `GITHUB_TOKEN` for authentication. No additional Docker-related secrets are needed.

## 5. Deployment Process Overview

The CI/CD pipeline (configured in `.github/workflows/ci-cd.yml`) handles the entire deployment process automatically when you push to the `main` branch.

### How it works:
1.  **Test & Build**: The pipeline first runs linting and builds the Next.js application to ensure there are no errors.
2.  **Docker Push**: It builds a Docker image and pushes it to the GitHub Container Registry.
3.  **Config Transfer**: It securely creates an `.env` file (populated with your Secrets) and copies the `docker-compose.yml` file to your server using SCP.
4.  **Deploy**: It logs into the server via SSH, pulls the new Docker image, and restarts the containers.
5.  **Database Management**:
    *   **Migrations**: Automatically runs `npx prisma migrate deploy` to apply any schema changes.

## 6. Configure the Server Firewall

Ensure your server's firewall allows traffic on the necessary ports. We will use `ufw` (Uncomplicated Firewall).

```bash
# Allow SSH connections (replace 22 with your custom SSH port if needed)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS traffic
sudo ufw allow http
sudo ufw allow https

# Allow the application ports for local health checks (optional, as Nginx proxies to localhost)
sudo ufw allow 3003 # Admin App Port

# Enable the firewall
sudo ufw enable

# Check the status
sudo ufw status
```

## 7. Set Up Nginx as a Reverse Proxy

Nginx will route external traffic from your domains to the correct Docker containers.

1.  **Install Nginx**:
    ```bash
    sudo apt update
    sudo apt install nginx
    ```

2.  **Create an Nginx Configuration File**: Create a new configuration file for your sites.
    ```bash
    sudo nano /etc/nginx/sites-available/flowrage
    ```

3.  **Add the Following Configuration**: Paste this configuration into the file. It sets up reverse proxies for both the frontend and admin domains.

    ```nginx
    # Frontend: flowrage.com
    server {
        listen 80;
        listen [::]:80;
        server_name flowrage.com www.flowrage.com;

        location / {
            proxy_pass http://localhost:3004;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # Admin Panel: admin.flowrage.com
    server {
        listen 80;
        listen [::]:80;
        server_name admin.flowrage.com;

        location / {
            proxy_pass http://localhost:3003;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

4.  **Enable the Site**: Create a symbolic link to enable the new configuration.
    ```bash
    sudo ln -s /etc/nginx/sites-available/flowrage /etc/nginx/sites-enabled/
    ```

5.  **Test and Restart Nginx**:
    ```bash
    # Test for syntax errors
    sudo nginx -t

    # Restart Nginx to apply the changes
    sudo systemctl restart nginx
    ```

## 8. Connect Your Domains

In your domain registrar's DNS management panel (e.g., GoDaddy, Namecheap, Cloudflare), create `A` records to point your domains to your server's IP address.

| Type | Name/Host              | Value/Points to | TTL   |
| ---- | ---------------------- | --------------- | ----- |
| A    | `@` (or `flowrage.com`) | `164.68.123.79` | Auto  |
| A    | `admin`                | `164.68.123.79` | Auto  |

*Note: DNS changes can take some time to propagate.*

## 9. Install SSL Certificates with Certbot

Secure your sites with free SSL certificates from Let's Encrypt.

1.  **Install Certbot**:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **Obtain and Install Certificates**: Run Certbot. It will automatically detect your domains from the Nginx configuration, obtain certificates, and configure Nginx to use them.
    ```bash
    # This command will handle both domains.
    # Choose the option to redirect HTTP traffic to HTTPS when prompted.
    sudo certbot --nginx -d flowrage.com -d www.flowrage.com -d admin.flowrage.com
    ```

3.  **Verify Auto-Renewal**: Certbot automatically sets up a cron job or systemd timer to renew your certificates before they expire. You can test the renewal process with a dry run.
    ```bash
    sudo certbot renew --dry-run
    ```

Your server is now fully configured. Pushing changes to the `main` branch of your repository will automatically trigger the CI/CD pipeline to build and deploy the applications.
