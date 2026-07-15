import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
export interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  tags: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  date: string;
  location: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  date: string;
  location: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string;
}

export interface Achievement {
  id: string;
  description: string;
}

export interface ResumeState {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  keyAchievements: Achievement[];
}

const defaultState: ResumeState = {
  personalInfo: {
    name: "Vivek Kalola",
    title: "Immediate Joiner",
    phone: "+918154096952",
    email: "vivekkalola009@gmail.com",
    linkedin: "linkedin.com/in/vivekkalola/",
    github: "github.com/vivekkalola",
    tags: "8+ YOE • PRODUCT ENGINEER • DISTRIBUTED SYSTEMS • AI OBSERVABILITY SPECIALIST",
    summary: "Innovative Sr. Software Engineer with 8+ years of experience specializing in Distributed Systems, AIOps, and LLM-integrated applications."
  },
  experiences: [
    {
      id: "1",
      company: "Vimeo",
      role: "Senior Software Engineer",
      date: "Feb, 2025 - Jan, 2026",
      location: "Bengaluru • Remote",
      highlights: [
        "Spearheaded the Google Meet integration, leveraging Windsurf to accelerate the development lifecycle.",
        "Re-architected fundamental SSO logic to decouple authentication dependencies."
      ]
    }
  ],
  education: [
    {
      id: "1",
      degree: "B.Tech in Information and Communication Technology (ICT)",
      school: "DA-IICT",
      date: "2013 - 2017",
      location: "Gandhinagar, Gujarat"
    }
  ],
  skills: [
    {
      id: "1",
      category: "Languages",
      items: "Go, Java, TypeScript, JavaScript, C, C++, Python"
    },
    {
      id: "2",
      category: "Frameworks",
      items: "React, Next.js, RESTful APIs, GraphQL"
    }
  ],
  keyAchievements: [
    {
      id: "1",
      description: "Describe what you did and the impact it had."
    }
  ]
};

interface ResumeContextType {
  data: ResumeState;
  updateData: (newData: ResumeState) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  updateExperience: (id: string, updated: Partial<Experience>) => void;
  addExperience: (exp: Experience) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: 'up' | 'down') => void;

  updateEducation: (id: string, updated: Partial<Education>) => void;
  addEducation: (edu: Education) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, direction: 'up' | 'down') => void;

  updateSkill: (id: string, updated: Partial<Skill>) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  moveSkill: (id: string, direction: 'up' | 'down') => void;

  updateKeyAchievement: (id: string, updated: Partial<Achievement>) => void;
  addKeyAchievement: (ach: Achievement) => void;
  removeKeyAchievement: (id: string) => void;
  moveKeyAchievement: (id: string, direction: 'up' | 'down') => void;
  saveResume: () => Promise<void>;
  exportPDF: () => void;
  isLoading: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ResumeState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      loadResume();
    }
  }, [isAuthenticated, token]);

  const loadResume = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/resumes/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (res.ok) {
        const json = await res.json();
        // Overwrite missing defaults if needed, assuming the payload is complete
        setData({
          personalInfo: json.personalInfo || defaultState.personalInfo,
          experiences: json.experiences || [],
          education: json.education || [],
          skills: json.skills || [],
          keyAchievements: json.keyAchievements || []
        });
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        throw new Error('Failed to save resume');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const exportPDF = async () => {
    try {
      const res = await fetch('/api/resumes/me/pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await res.blob();
      // Ensure the blob is treated as a PDF so the browser opens it in the built-in viewer
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Export PDF failed:', err);
      import('react-hot-toast').then(m => m.default.error('Failed to export PDF'));
    }
  };

  const updateData = (newData: ResumeState) => setData(newData);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  // Helper for generic array updates
  const updateArrayItem = <K extends keyof ResumeState>(key: K, id: string, updated: any) => {
    setData(prev => {
      const arr = prev[key] as any[];
      return { ...prev, [key]: arr.map(item => item.id === id ? { ...item, ...updated } : item) };
    });
  };

  const addArrayItem = <K extends keyof ResumeState>(key: K, item: any) => {
    setData(prev => {
      const arr = prev[key] as any[];
      return { ...prev, [key]: [...arr, item] };
    });
  };

  const removeArrayItem = <K extends keyof ResumeState>(key: K, id: string) => {
    setData(prev => {
      const arr = prev[key] as any[];
      return { ...prev, [key]: arr.filter(item => item.id !== id) };
    });
  };

  const moveArrayItem = <K extends keyof ResumeState>(key: K, id: string, direction: 'up' | 'down') => {
    setData(prev => {
      const arr = prev[key] as any[];
      const idx = arr.findIndex(e => e.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === arr.length - 1) return prev;
      
      const newArr = [...arr];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      
      [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
      
      return { ...prev, [key]: newArr };
    });
  };

  return (
    <ResumeContext.Provider value={{
      data,
      updateData,
      updatePersonalInfo,
      
      updateExperience: (id, u) => updateArrayItem('experiences', id, u),
      addExperience: (i) => addArrayItem('experiences', i),
      removeExperience: (id) => removeArrayItem('experiences', id),
      moveExperience: (id, d) => moveArrayItem('experiences', id, d),

      updateEducation: (id, u) => updateArrayItem('education', id, u),
      addEducation: (i) => addArrayItem('education', i),
      removeEducation: (id) => removeArrayItem('education', id),
      moveEducation: (id, d) => moveArrayItem('education', id, d),

      updateSkill: (id, u) => updateArrayItem('skills', id, u),
      addSkill: (i) => addArrayItem('skills', i),
      removeSkill: (id) => removeArrayItem('skills', id),
      moveSkill: (id, d) => moveArrayItem('skills', id, d),

      updateKeyAchievement: (id, u) => updateArrayItem('keyAchievements', id, u),
      addKeyAchievement: (i) => addArrayItem('keyAchievements', i),
      removeKeyAchievement: (id) => removeArrayItem('keyAchievements', id),
      moveKeyAchievement: (id, d) => moveArrayItem('keyAchievements', id, d),
      saveResume,
      exportPDF,
      isLoading,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
