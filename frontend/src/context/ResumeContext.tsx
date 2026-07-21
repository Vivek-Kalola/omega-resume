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

const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode(true);
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      
      const fragment = document.createDocumentFragment();
      el.childNodes.forEach(child => {
        const cleanedChild = cleanNode(child);
        if (cleanedChild) {
          fragment.appendChild(cleanedChild);
        }
      });
      
      const isBold = tagName === 'b' || tagName === 'strong' || 
                     el.style.fontWeight === 'bold' || 
                     el.style.fontWeight === 'bolder' || 
                     (el.style.fontWeight && parseInt(el.style.fontWeight) >= 600);
                     
      const isItalic = tagName === 'i' || tagName === 'em' || 
                       el.style.fontStyle === 'italic';
                       
      const isUnderline = tagName === 'u' || 
                          el.style.textDecorationLine === 'underline' || 
                          el.style.textDecoration.includes('underline');

      const isBr = tagName === 'br';
      
      if (isBr) {
        return document.createElement('br');
      }
      
      let currentRoot: Node = fragment;
      
      if (isUnderline) {
        const u = document.createElement('u');
        u.appendChild(currentRoot);
        currentRoot = u;
      }
      if (isItalic) {
        const em = document.createElement('em');
        em.appendChild(currentRoot);
        currentRoot = em;
      }
      if (isBold) {
        const strong = document.createElement('strong');
        strong.appendChild(currentRoot);
        currentRoot = strong;
      }
      
      return currentRoot;
    }
    return null;
  };
  
  const fragment = document.createDocumentFragment();
  doc.body.childNodes.forEach(child => {
    const cleaned = cleanNode(child);
    if (cleaned) {
      fragment.appendChild(cleaned);
    }
  });
  
  const div = document.createElement('div');
  div.appendChild(fragment);
  return div.innerHTML;
};

const sanitizeResumeState = (state: ResumeState): ResumeState => {
  return {
    personalInfo: {
      name: sanitizeHtml(state.personalInfo.name),
      title: sanitizeHtml(state.personalInfo.title),
      phone: sanitizeHtml(state.personalInfo.phone),
      email: sanitizeHtml(state.personalInfo.email),
      linkedin: sanitizeHtml(state.personalInfo.linkedin),
      github: sanitizeHtml(state.personalInfo.github),
      tags: sanitizeHtml(state.personalInfo.tags),
      summary: sanitizeHtml(state.personalInfo.summary),
    },
    experiences: state.experiences.map(exp => ({
      ...exp,
      company: sanitizeHtml(exp.company),
      role: sanitizeHtml(exp.role),
      date: sanitizeHtml(exp.date),
      location: sanitizeHtml(exp.location),
      highlights: exp.highlights.map(h => sanitizeHtml(h)),
    })),
    education: state.education.map(edu => ({
      ...edu,
      degree: sanitizeHtml(edu.degree),
      school: sanitizeHtml(edu.school),
      date: sanitizeHtml(edu.date),
      location: sanitizeHtml(edu.location),
    })),
    skills: state.skills.map(skill => ({
      ...skill,
      category: sanitizeHtml(skill.category),
      items: sanitizeHtml(skill.items),
    })),
    keyAchievements: state.keyAchievements.map(ach => ({
      ...ach,
      description: sanitizeHtml(ach.description),
    })),
  };
};

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
    const sanitizedData = sanitizeResumeState(data);
    setData(sanitizedData);

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
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
