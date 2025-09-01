export class AdminDashboard {
    constructor(authManager) {
        this.authManager = authManager;
    }

    render() {
        return `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b border-gray-200">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <div class="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                    <i data-lucide="shield-check" class="h-5 w-5 text-white"></i>
                                </div>
                                <h1 class="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                            </div>
                            <button id="logout-btn" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                <i data-lucide="log-out" class="h-4 w-4 mr-2"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Upload Policy Section -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center mb-6">
                                <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <i data-lucide="upload" class="h-5 w-5 text-blue-600"></i>
                                </div>
                                <h2 class="text-lg font-semibold text-gray-900">Upload Policy</h2>
                            </div>
                            
                            <form id="upload-form" class="space-y-4">
                                <div>
                                    <label for="policy-title" class="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
                                    <input type="text" id="policy-title" required
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                           placeholder="Enter policy title">
                                </div>
                                
                                <div>
                                    <label for="policy-description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea id="policy-description" rows="3"
                                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                              placeholder="Enter policy description"></textarea>
                                </div>
                                
                                <div>
                                    <label for="policy-file" class="block text-sm font-medium text-gray-700 mb-2">Policy Document</label>
                                    <input type="file" id="policy-file" required accept=".pdf,.doc,.docx,.txt"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    <p class="mt-1 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
                                </div>
                                
                                <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                                    Upload Policy
                                </button>
                            </form>
                        </div>

                        <!-- Create Employee Section -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center mb-6">
                                <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <i data-lucide="user-plus" class="h-5 w-5 text-green-600"></i>
                                </div>
                                <h2 class="text-lg font-semibold text-gray-900">Create Employee</h2>
                            </div>
                            
                            <form id="employee-form" class="space-y-4">
                                <div>
                                    <label for="employee-id" class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                                    <input type="text" id="employee-id" required
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                           placeholder="Enter unique employee ID">
                                </div>
                                
                                <div>
                                    <label for="employee-password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" id="employee-password" required
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                           placeholder="Enter password (min 6 characters)">
                                </div>
                                
                                <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
                                    Create Employee
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Policies List -->
                    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i data-lucide="file-text" class="h-5 w-5 text-purple-600"></i>
                                    </div>
                                    <h2 class="text-lg font-semibold text-gray-900">Company Policies</h2>
                                </div>
                                <button id="refresh-policies" class="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                    <i data-lucide="refresh-cw" class="h-4 w-4 mr-2"></i>
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div id="policies-list" class="p-6">
                            <div class="flex items-center justify-center py-8">
                                <i data-lucide="loader-2" class="h-6 w-6 animate-spin text-gray-400 mr-2"></i>
                                <span class="text-gray-500">Loading policies...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Employees List -->
                    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                        <i data-lucide="users" class="h-5 w-5 text-orange-600"></i>
                                    </div>
                                    <h2 class="text-lg font-semibold text-gray-900">Employees</h2>
                                </div>
                                <button id="refresh-employees" class="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                    <i data-lucide="refresh-cw" class="h-4 w-4 mr-2"></i>
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div id="employees-list" class="p-6">
                            <div class="flex items-center justify-center py-8">
                                <i data-lucide="loader-2" class="h-6 w-6 animate-spin text-gray-400 mr-2"></i>
                                <span class="text-gray-500">Loading employees...</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <script>
                lucide.createIcons();
                
                // Setup event listeners
                document.getElementById('logout-btn').addEventListener('click', () => {
                    document.dispatchEvent(new CustomEvent('logout'));
                });

                // Upload form handler
                document.getElementById('upload-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const formData = new FormData();
                    formData.append('title', document.getElementById('policy-title').value);
                    formData.append('description', document.getElementById('policy-description').value);
                    formData.append('file', document.getElementById('policy-file').files[0]);
                    
                    try {
                        const response = await fetch('/api/admin/policies/upload', {
                            method: 'POST',
                            headers: ${JSON.stringify(this.authManager.getAuthHeaders())},
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            alert('Policy uploaded successfully!');
                            document.getElementById('upload-form').reset();
                            loadPolicies();
                        } else {
                            alert('Error: ' + result.message);
                        }
                    } catch (error) {
                        alert('Network error occurred');
                    }
                });

                // Employee form handler
                document.getElementById('employee-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const employeeData = {
                        employeeId: document.getElementById('employee-id').value,
                        password: document.getElementById('employee-password').value
                    };
                    
                    try {
                        const response = await fetch('/api/admin/employees', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                ...${JSON.stringify(this.authManager.getAuthHeaders())}
                            },
                            body: JSON.stringify(employeeData)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            alert('Employee created successfully!');
                            document.getElementById('employee-form').reset();
                            loadEmployees();
                        } else {
                            alert('Error: ' + result.message);
                        }
                    } catch (error) {
                        alert('Network error occurred');
                    }
                });

                // Load policies
                async function loadPolicies() {
                    try {
                        const response = await fetch('/api/admin/policies', {
                            headers: ${JSON.stringify(this.authManager.getAuthHeaders())}
                        });
                        
                        const result = await response.json();
                        const policiesDiv = document.getElementById('policies-list');
                        
                        if (result.success && result.data.length > 0) {
                            policiesDiv.innerHTML = result.data.map(policy => \`
                                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                                    <div class="flex-1">
                                        <h3 class="font-medium text-gray-900">\${policy.title}</h3>
                                        <p class="text-sm text-gray-500">\${policy.description || 'No description'}</p>
                                        <p class="text-xs text-gray-400 mt-1">Uploaded: \${new Date(policy.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">\${policy.fileType}</span>
                                        <button onclick="deletePolicy('\${policy.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                </div>
                            \`).join('');
                        } else {
                            policiesDiv.innerHTML = \`
                                <div class="text-center py-8">
                                    <i data-lucide="file-x" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                                    <p class="text-gray-500">No policies uploaded yet</p>
                                </div>
                            \`;
                        }
                        lucide.createIcons();
                    } catch (error) {
                        document.getElementById('policies-list').innerHTML = \`
                            <div class="text-center py-8">
                                <p class="text-red-500">Error loading policies</p>
                            </div>
                        \`;
                    }
                }

                // Load employees
                async function loadEmployees() {
                    try {
                        const response = await fetch('/api/admin/employees', {
                            headers: ${JSON.stringify(this.authManager.getAuthHeaders())}
                        });
                        
                        const result = await response.json();
                        const employeesDiv = document.getElementById('employees-list');
                        
                        if (result.success && result.data.length > 0) {
                            employeesDiv.innerHTML = result.data.map(employee => \`
                                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                                    <div class="flex-1">
                                        <h3 class="font-medium text-gray-900">\${employee.employeeId}</h3>
                                        <p class="text-sm text-gray-500">Role: \${employee.role}</p>
                                        <p class="text-xs text-gray-400 mt-1">Created: \${new Date(employee.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                        <button onclick="deactivateEmployee('\${employee.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                            <i data-lucide="user-x" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                </div>
                            \`).join('');
                        } else {
                            employeesDiv.innerHTML = \`
                                <div class="text-center py-8">
                                    <i data-lucide="users" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                                    <p class="text-gray-500">No employees created yet</p>
                                </div>
                            \`;
                        }
                        lucide.createIcons();
                    } catch (error) {
                        document.getElementById('employees-list').innerHTML = \`
                            <div class="text-center py-8">
                                <p class="text-red-500">Error loading employees</p>
                            </div>
                        \`;
                    }
                }

                // Delete policy function
                window.deletePolicy = async (policyId) => {
                    if (confirm('Are you sure you want to delete this policy?')) {
                        try {
                            const response = await fetch(\`/api/admin/policies/\${policyId}\`, {
                                method: 'DELETE',
                                headers: ${JSON.stringify(this.authManager.getAuthHeaders())}
                            });
                            
                            const result = await response.json();
                            
                            if (result.success) {
                                alert('Policy deleted successfully!');
                                loadPolicies();
                            } else {
                                alert('Error: ' + result.message);
                            }
                        } catch (error) {
                            alert('Network error occurred');
                        }
                    }
                };

                // Deactivate employee function
                window.deactivateEmployee = async (employeeId) => {
                    if (confirm('Are you sure you want to deactivate this employee?')) {
                        try {
                            const response = await fetch(\`/api/admin/employees/\${employeeId}/deactivate\`, {
                                method: 'PUT',
                                headers: ${JSON.stringify(this.authManager.getAuthHeaders())}
                            });
                            
                            const result = await response.json();
                            
                            if (result.success) {
                                alert('Employee deactivated successfully!');
                                loadEmployees();
                            } else {
                                alert('Error: ' + result.message);
                            }
                        } catch (error) {
                            alert('Network error occurred');
                        }
                    }
                };

                // Refresh buttons
                document.getElementById('refresh-policies').addEventListener('click', loadPolicies);
                document.getElementById('refresh-employees').addEventListener('click', loadEmployees);

                // Load initial data
                loadPolicies();
                loadEmployees();
            </script>
        `;
    }
}