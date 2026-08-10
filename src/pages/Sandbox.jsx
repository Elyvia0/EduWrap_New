import { useState } from 'react';
import { User, Settings, Folder, Search, Play, FileText } from 'lucide-react';
import { Button, IconButton } from '../components/ui/Button';
import { Input, SearchInput, Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Tooltip } from '../components/ui/Tooltip';
import { Dropdown, DropdownItem, DropdownDivider } from '../components/ui/Dropdown';
import { Tabs } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Avatar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge, CountBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { FileCard } from '../components/ui/FileCard';
import { FloatingPanel } from '../components/ui/FloatingPanel';
import { Toast, useToast } from '../components/ui/Toast';
import { LoadingSkeleton, CardSkeleton, ListSkeleton } from '../components/ui/LoadingSkeleton';

export default function Sandbox() {
  const [modalOpen, setModalOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const tabs = [
    { id: 'tab1', label: 'Overview', icon: FileText, badge: '3' },
    { id: 'tab2', label: 'Settings', icon: Settings },
    { id: 'tab3', label: 'Members', icon: User },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 w-full min-w-0">
      <div>
        <h1 className="text-3xl font-bold mb-8">UI Components Sandbox</h1>
        
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <IconButton><Settings size={20} /></IconButton>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Inputs</h2>
          <div className="max-w-md space-y-4">
            <Input placeholder="Standard input" />
            <SearchInput placeholder="Search items..." />
            <Input placeholder="Error input" error="This field is required" />
            <Textarea placeholder="Type your message here..." />
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Cards & Avatars</h2>
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">User Profile</h3>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar initials="JD" status="online" size="lg" />
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-(--text-muted)">Software Engineer</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Data Display</h2>
            <div className="flex items-center gap-6 mb-6">
              <ProgressRing progress={75} size={80} strokeWidth={8} />
              <div className="flex gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <CountBadge count={5} />
                <CountBadge count={120} />
              </div>
            </div>
            
            <div className="space-y-4">
              <FileCard name="Project_Proposal.pdf" type="pdf" size="2.4 MB" date="Today" />
              <FileCard name="Hero_Image.png" type="image" size="4.1 MB" date="Yesterday" />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Navigation & Overlays</h2>
          <div className="flex items-center gap-8 mb-6">
            <Tabs tabs={tabs} />
            
            <Dropdown trigger={<Button variant="outline">Open Menu</Button>}>
              <DropdownItem icon={User}>Profile</DropdownItem>
              <DropdownItem icon={Settings}>Settings</DropdownItem>
              <DropdownDivider />
              <DropdownItem className="text-red-500">Logout</DropdownItem>
            </Dropdown>

            <Tooltip content="This is a helpful tooltip!" position="top">
              <Button variant="secondary">Hover me</Button>
            </Tooltip>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button onClick={() => setPanelOpen(true)}>Open Floating Panel</Button>
            <Button onClick={() => showToast('Action completed successfully!', 'success')}>Show Toast</Button>
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Empty States</h2>
            <EmptyState 
              icon={Folder}
              title="No files yet"
              description="Upload files to share with your study group."
              actionLabel="Upload File"
              onAction={() => console.log('upload')}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-(--border-default) pb-2">Skeletons</h2>
            <Card className="p-4 mb-4"><CardSkeleton /></Card>
            <Card className="p-4"><ListSkeleton count={2} /></Card>
          </div>
        </section>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Project">
        <div className="space-y-4">
          <Input placeholder="Project Name" />
          <Textarea placeholder="Project Description" />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Create</Button>
          </div>
        </div>
      </Modal>

      <FloatingPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} title="Quick Notes">
        <Textarea className="h-full min-h-[200px]" placeholder="Type some quick notes here..." />
      </FloatingPanel>

      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
