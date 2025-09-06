import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ExternalLink, Code, Globe } from 'lucide-react';

export default function ApiIntegration() {
  const navigate = useNavigate();
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApiCall = async () => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Globe className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold">API Integration</h1>
            </div>
            <p className="text-gray-400">
              Connect to external APIs to fetch course content and data
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* API Configuration */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Code className="h-5 w-5" />
                  <span>API Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl" className="text-gray-300">API URL</Label>
                  <Input
                    id="apiUrl"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.example.com/courses"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-gray-300">API Key (Optional)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleApiCall}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Fetching...' : 'Fetch Data'}
                </Button>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="font-semibold mb-2 text-white">Sample APIs to Try:</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApiUrl('https://jsonplaceholder.typicode.com/posts')}
                      className="w-full text-left justify-start border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      JSONPlaceholder Posts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApiUrl('https://api.github.com/repos/microsoft/vscode')}
                      className="w-full text-left justify-start border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GitHub Repository Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApiUrl('https://httpbin.org/json')}
                      className="w-full text-left justify-start border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      HTTPBin JSON Response
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Response */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-gray-300">Response Data</Label>
                  <Textarea
                    value={response}
                    readOnly
                    placeholder="API response will appear here..."
                    className="min-h-96 bg-gray-800 border-gray-700 text-white font-mono text-sm"
                  />
                </div>
                
                {response && (
                  <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                    <p className="text-green-400 text-sm">
                      ✅ Successfully fetched data from external API
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card className="mt-8 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Enter API URL</h4>
                  <p className="text-gray-400 text-sm">
                    Provide the URL of the external API you want to connect to
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Add API Key</h4>
                  <p className="text-gray-400 text-sm">
                    If required, add your API key for authentication
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-400 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Fetch Data</h4>
                  <p className="text-gray-400 text-sm">
                    Click fetch to retrieve and display the API response
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}