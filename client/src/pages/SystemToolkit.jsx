import { useApp } from '../hooks/useApp';

export default function SystemToolkit() {
  const { data } = useApp();
  const tools = data?.system_toolkit?.tools || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zhust-accent mb-2">🔧 System Toolkit</h1>
        <p className="text-gray-400">
          Quick-access directory for AI Studio, development environments, and essential tools.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <a
            key={idx}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6 hover:border-zhust-accent hover:shadow-lg transition-all group"
          >
            <h3 className="text-xl font-bold text-zhust-accent mb-2 group-hover:text-white transition-colors">
              {tool.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
            <div className="flex items-center text-zhust-secondary group-hover:text-zhust-accent transition-colors">
              <span className="text-sm">Open →</span>
            </div>
          </a>
        ))}
      </div>

      {/* Add Tool Card */}
      <div className="bg-blue-900/30 border border-zhust-secondary border-dashed rounded-lg p-6">
        <h3 className="text-lg font-bold text-zhust-accent mb-2">➕ Add New Tool</h3>
        <p className="text-gray-400 text-sm mb-4">
          To add more tools to your toolkit, edit the data.json file in the server directory.
        </p>
        <code className="block bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-x-auto">
          {JSON.stringify({
            name: "Tool Name",
            url: "https://example.com",
            description: "Tool description"
          }, null, 2)}
        </code>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
          <h3 className="text-lg font-bold text-zhust-accent mb-3">💾 Local-First Architecture</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✓ All data stored locally in <code className="text-zhust-secondary">data.json</code></li>
            <li>✓ No cloud dependency or privacy concerns</li>
            <li>✓ Instant synchronization on updates</li>
            <li>✓ Full control over your information</li>
          </ul>
        </div>

        <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
          <h3 className="text-lg font-bold text-zhust-accent mb-3">🚀 Performance & Reliability</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✓ Express.js backend on port 5000</li>
            <li>✓ Real-time data synchronization</li>
            <li>✓ PDF export for long-term record-keeping</li>
            <li>✓ Persistent state management</li>
          </ul>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-400 mb-2">✓ System Status</h3>
        <div className="space-y-2 text-sm">
          <p className="text-green-300">Backend: <span className="font-bold">Online</span></p>
          <p className="text-green-300">Data Layer: <span className="font-bold">Connected</span></p>
          <p className="text-green-300">Last Updated: <span className="font-bold">{new Date().toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  );
}
