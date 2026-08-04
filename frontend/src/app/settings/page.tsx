'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@wrksz/themes/client';
import { User, Shield, Moon, Sun, Monitor, AlertTriangle, Upload, CheckCircle2, Smartphone, Mail, Globe, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false,
  });

  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleSavePassword = () => {
    toast.success('Password updated successfully');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px] h-12 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:shadow-sm">Profile</TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg data-[state=active]:shadow-sm">Account</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:shadow-sm">Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 w-full" />
              <CardHeader className="relative pt-0">
                <div className="flex justify-between items-end -mt-12 mb-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                      <AvatarImage src={user?.avatar} referrerPolicy="no-referrer" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {user?.name?.charAt(0) || <User className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-background">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <Button variant="outline" className="shadow-sm">Upload new avatar</Button>
                </div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email} disabled className="bg-muted/50 opacity-70" />
                    <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3" /> Managed via Google Auth
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" placeholder="Community Manager" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Acme Inc" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Write a few sentences about yourself"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/20 py-4">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <Button onClick={handleSavePassword} className="w-full mt-2">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center gap-6">
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${twoFactor ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Authenticator App</p>
                        <p className="text-xs text-muted-foreground">{twoFactor ? 'Configured' : 'Not configured'}</p>
                      </div>
                    </div>
                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </div>
                  {twoFactor && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 p-3 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" /> 2FA is active on your account
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-destructive/30 bg-destructive/5 mt-6 shadow-sm">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Light Mode */}
                  <div 
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Sun className="h-5 w-5" /></div>
                      {theme === 'light' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <h3 className="font-semibold mb-1">Light Mode</h3>
                    <p className="text-xs text-muted-foreground">Bright and clear for daytime use.</p>
                  </div>

                  {/* Dark Mode */}
                  <div 
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><Moon className="h-5 w-5" /></div>
                      {theme === 'dark' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <h3 className="font-semibold mb-1">Dark Mode</h3>
                    <p className="text-xs text-muted-foreground">Easier on the eyes in low light.</p>
                  </div>

                  {/* System Defaults */}
                  <div 
                    onClick={() => setTheme('system')}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="p-2 bg-zinc-500/10 text-zinc-500 rounded-lg"><Monitor className="h-5 w-5" /></div>
                      {theme === 'system' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <h3 className="font-semibold mb-1">System Defaults</h3>
                    <p className="text-xs text-muted-foreground">Follows your OS theme settings.</p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
