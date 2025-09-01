export class EmployeeDashboard {
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
                                    <i data-lucide="user" class="h-5 w-5 text-white"></i>
                                </div>
                                <h1 class="text-xl font-semibold text-gray-900">Employee Dashboard</h1>
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
                    <!-- Welcome Section -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div class="flex items-center">
                            <div class="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                                <i data-lucide="briefcase" class="h-6 w-6 text-indigo-600"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900">Welcome, ${this.authManager.getCurrentUser()?.employeeId}</h2>
                                <p class="text-gray-600">Access and download company policies below</p>
                            </div>
                        </div>
                    </div>

                    <!-- Policies Section -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <i data-lucide="file-text" class="h-5 w-5 text-blue-600"></i>
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
                </main>
            </div>

            <script>
                lucide.createIcons();
                
                // Setup event listeners
                document.getElementById('logout-btn').addEventListener('click', () => {
                    document.dispatchEvent(new CustomEvent('logout'));
                });

                // Load policies
                async function loadPolicies() {
                    try {
                        const response = await fetch('/api/employee/policies', {
                            headers: ${JSON.stringify(this.authManager.getAuthHeaders())}
                        });
                        
                        const result = await response.json();
                        const policiesDiv = document.getElementById('policies-list');
                        
                        if (result.success && result.data.length > 0) {
                            policiesDiv.innerHTML = result.data.map(policy => \`
                                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-colors duration-200">
                                    <div class="flex-1">
                                        <h3 class="font-medium text-gray-900">\${policy.title}</h3>
                                        <p class="text-sm text-gray-500">\${policy.description || 'No description'}</p>
                                        <div class="flex items-center mt-2 space-x-4">
                                            <span class="text-xs text-gray-400">Uploaded: \${new Date(policy.createdAt).toLocaleDateString()}</span>
                                            <span class="text-xs text-gray-400">By: \${policy.uploadedBy}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">\${policy.fileType}</span>
                                        <button onclick="downloadPolicy('\${policy.id}')" class="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                                            <i data-lucide="download" class="h-4 w-4 mr-2"></i>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            \`).join('');
                        } else {
                            policiesDiv.innerHTML = \`
                                <div class="text-center py-8">
                                    <i data-lucide="file-x" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                                    <p class="text-gray-500">No policies available</p>
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

                // Download policy function
                window.downloadPolicy = async (policyId) => {
                    try {
                        const response = await fetch(\`/api/employee/policies/\${policyId}/download\`, {
                            headers: ${JSON.stringify(this.authManager.getAuthHeaders())}
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.open(result.data, '_blank');
                        } else {
                            alert('Error: ' + result.message);
                        }
                    } catch (error) {
                        alert('Network error occurred');
                    }
                };

                // Refresh button
                document.getElementById('refresh-policies').addEventListener('click', loadPolicies);

                // Load initial data
                loadPolicies();
            </script>
        `;
    }
}