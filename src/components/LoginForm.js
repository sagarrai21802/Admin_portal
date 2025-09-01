export class LoginForm {
    constructor(authManager) {
        this.authManager = authManager;
    }

    render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div class="max-w-md w-full space-y-8 p-8">
                    <div class="bg-white rounded-2xl shadow-xl p-8">
                        <div class="text-center mb-8">
                            <div class="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                                <i data-lucide="shield-check" class="h-8 w-8 text-white"></i>
                            </div>
                            <h2 class="text-3xl font-bold text-gray-900">Policy Management</h2>
                            <p class="mt-2 text-gray-600">Sign in to your account</p>
                        </div>

                        <div class="space-y-4">
                            <div class="flex bg-gray-100 rounded-lg p-1">
                                <button id="admin-tab" class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-white text-indigo-600 shadow-sm">
                                    Admin
                                </button>
                                <button id="employee-tab" class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-700">
                                    Employee
                                </button>
                            </div>

                            <form id="login-form" class="space-y-6">
                                <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"></div>
                                
                                <div>
                                    <label for="employeeId" class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                                    <input type="text" id="employeeId" name="employeeId" required
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                           placeholder="Enter your employee ID">
                                </div>

                                <div>
                                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" id="password" name="password" required
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                           placeholder="Enter your password">
                                </div>

                                <button type="submit" id="login-btn"
                                        class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                                    <span id="login-text">Sign In as Admin</span>
                                    <span id="login-spinner" class="hidden">
                                        <i data-lucide="loader-2" class="h-4 w-4 animate-spin inline mr-2"></i>
                                        Signing in...
                                    </span>
                                </button>
                            </form>

                            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h3 class="text-sm font-medium text-blue-900 mb-2">Default Credentials:</h3>
                                <p class="text-sm text-blue-700">
                                    <strong>Admin:</strong> admin / admin123<br>
                                    <strong>Employee:</strong> Created by admin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                lucide.createIcons();
                
                let currentRole = 'ADMIN';
                
                document.getElementById('admin-tab').addEventListener('click', () => {
                    currentRole = 'ADMIN';
                    updateTabs();
                    document.getElementById('login-text').textContent = 'Sign In as Admin';
                });
                
                document.getElementById('employee-tab').addEventListener('click', () => {
                    currentRole = 'EMPLOYEE';
                    updateTabs();
                    document.getElementById('login-text').textContent = 'Sign In as Employee';
                });
                
                function updateTabs() {
                    const adminTab = document.getElementById('admin-tab');
                    const employeeTab = document.getElementById('employee-tab');
                    
                    if (currentRole === 'ADMIN') {
                        adminTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-white text-indigo-600 shadow-sm';
                        employeeTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-700';
                    } else {
                        employeeTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-white text-indigo-600 shadow-sm';
                        adminTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-700';
                    }
                }
                
                document.getElementById('login-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const employeeId = document.getElementById('employeeId').value;
                    const password = document.getElementById('password').value;
                    const errorDiv = document.getElementById('error-message');
                    const loginBtn = document.getElementById('login-btn');
                    const loginText = document.getElementById('login-text');
                    const loginSpinner = document.getElementById('login-spinner');
                    
                    // Show loading state
                    loginText.classList.add('hidden');
                    loginSpinner.classList.remove('hidden');
                    loginBtn.disabled = true;
                    errorDiv.classList.add('hidden');
                    
                    try {
                        const result = await window.authManager.login(employeeId, password, currentRole);
                        
                        if (!result.success) {
                            errorDiv.textContent = result.error;
                            errorDiv.classList.remove('hidden');
                        }
                    } catch (error) {
                        errorDiv.textContent = 'An error occurred during login';
                        errorDiv.classList.remove('hidden');
                    } finally {
                        // Reset loading state
                        loginText.classList.remove('hidden');
                        loginSpinner.classList.add('hidden');
                        loginBtn.disabled = false;
                        lucide.createIcons();
                    }
                });
                
                // Make authManager available globally for the form
                window.authManager = ${JSON.stringify(this.authManager)};
            </script>
        `;
    }
}