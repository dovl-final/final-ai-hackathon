import { render, screen } from '@testing-library/react';
import ProjectCard from '../../src/components/ProjectCard';
import { ProjectWithCreator } from '../../src/types';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('ProjectCard', () => {
  const mockProject: ProjectWithCreator = {
    id: '1',
    title: 'Test Project',
    description: 'This is a test project',
    minTeamSize: 2,
    maxTeamSize: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'user1',
    creator: {
      id: 'user1',
      name: 'Test User',
      email: 'test@final.co.il',
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />);
    
    // Check if title and description are rendered
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project')).toBeInTheDocument();
    
    // Check if team size is rendered
    expect(screen.getByText(/2 - 5 members/)).toBeInTheDocument();
    
    // Check if creator name is rendered
    expect(screen.getByText(/Created by: Test User/)).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for non-owners', () => {
    render(<ProjectCard project={mockProject} />);
    
    // Edit and Delete buttons should not be visible for non-owners
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
