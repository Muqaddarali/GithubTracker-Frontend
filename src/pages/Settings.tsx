
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import GitHubConnector from '@/components/dashboard/GitHubConnector';

const Settings = () => {
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  const [githubToken, setGithubToken] = useState<string>('');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load saved settings
    const storedOwner = localStorage.getItem('repoOwner');
    const storedRepo = localStorage.getItem('repoName');
    const storedToken = localStorage.getItem('githubToken');
    
    if (storedOwner) setOwner(storedOwner);
    if (storedRepo) setRepo(storedRepo);
    if (storedToken) setGithubToken(storedToken);
    
    // Check if dark mode is enabled
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);
  
  const handleSaveToken = () => {
    localStorage.setItem('githubToken', githubToken);
    toast({
      title: "Settings saved",
      description: "GitHub token has been saved successfully",
    });
  };
  
  const handleDisconnectRepo = () => {
    localStorage.removeItem('repoOwner');
    localStorage.removeItem('repoName');
    setOwner('');
    setRepo('');
    toast({
      title: "Repository disconnected",
      description: "The repository has been disconnected successfully",
    });
    
    // Reload page to update UI
    window.location.reload();
  };
  
  const handleRepoConnect = (newOwner: string, newRepo: string) => {
    localStorage.setItem('repoOwner', newOwner);
    localStorage.setItem('repoName', newRepo);
    setOwner(newOwner);
    setRepo(newRepo);
  };
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Repository Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {!owner || !repo ? (
                  <GitHubConnector onConnect={handleRepoConnect} />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Connected Repository:</p>
                      <p className="text-lg">{owner}/{repo}</p>
                    </div>
                    <Button variant="destructive" onClick={handleDisconnectRepo}>
                      Disconnect Repository
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>GitHub API Token</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                    <Input 
                      id="github-token"
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="Enter your GitHub token"
                    />
                    <p className="text-xs text-muted-foreground">
                      This token is required for accessing GitHub API. It will be stored locally in your browser.
                    </p>
                  </div>
                  <Button onClick={handleSaveToken}>Save Token</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts for new contributions</p>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <Separator />
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Reset All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>About GitPulse</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Version: 1.0.0</p>
                <p className="text-sm text-muted-foreground mt-2">
                  GitPulse is a GitHub contribution tracking application that helps teams monitor and analyze their development activity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
