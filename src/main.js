import { AuthManager } from './auth/AuthManager.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { EmployeeDashboard } from './components/EmployeeDashboard.js';
import { LoginForm } from './components/LoginForm.js';

class App {
    constructor() {
        this.authManager = new AuthManager();
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.authManager.init();
        this.currentUser = this.authManager.getCurrentUser();
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('auth-changed', (event) => {
            this.currentUser = event.detail.user;
            this.render();
        });

        document.addEventListener('logout', () => {
            this.authManager.logout();
            this.currentUser = null;
            this.render();
        });
    }

    render() {
        const app = document.getElementById('app');
        
        if (!this.currentUser) {
            app.innerHTML = new LoginForm(this.authManager).render();
        } else if (this.currentUser.role === 'ADMIN') {
            app.innerHTML = new AdminDashboard(this.authManager).render();
        } else {
            app.innerHTML = new EmployeeDashboard(this.authManager).render();
        }
    }
}

new App();