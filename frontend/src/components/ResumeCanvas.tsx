import { useResume } from '../context/ResumeContext';
import { EditableSection } from './EditableSection';
import { FormatToolbar } from './FormatToolbar';
import { Phone, Mail, Globe, Code, PlusCircle, Trash2, MoveUp, MoveDown } from 'lucide-react';
import ReactContentEditable from 'react-contenteditable';

const ContentEditable = (ReactContentEditable as any).default || ReactContentEditable;

const DirectEdit = ({ value, onChange, tagName = "span", className, isPreview }: any) => {
  return (
    <ContentEditable
      html={typeof value === 'string' ? value : (Array.isArray(value) ? value.join(' • ') : (value ? String(value) : ''))}
      disabled={isPreview}
      onChange={(e: any) => onChange(e.target.value)}
      tagName={tagName}
      className={`direct-edit-field focus:outline-none hover:bg-black/5 focus:bg-yellow-50/50 rounded-[2px] transition-colors cursor-text empty:before:content-['Empty'] empty:before:text-gray-400 empty:before:italic ${className}`}
    />
  );
};

export const ResumeCanvas = ({ isPreview }: { isPreview: boolean }) => {
  const {
    data,
    updatePersonalInfo,
    updateExperience, moveExperience, removeExperience, addExperience,
    updateEducation, moveEducation, removeEducation, addEducation,
    updateSkill, moveSkill, removeSkill, addSkill,
    updateKeyAchievement, moveKeyAchievement, removeKeyAchievement, addKeyAchievement
  } = useResume();

  const handleExpAdd = () => {
    addExperience({
      id: Date.now().toString(),
      company: 'New Company',
      role: 'Role',
      date: 'Date',
      location: 'Location',
      highlights: ['Added value by...']
    });
  };

  return (
    <div className="bg-white min-h-full font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-[12px] leading-[1.4] text-[#222222] p-[0.1in] print:p-0.1 print:m-[0_-0.2in]">
      {!isPreview && <FormatToolbar />}
      {/* Header Section */}
      <EditableSection isPreview={isPreview}>
        <header className="text-center">
          <div className="flex justify-center items-baseline gap-[10px] m-0 p-0">
            <DirectEdit
              isPreview={isPreview}
              tagName="h1"
              className="text-[#1a4f7a] text-[24px] tracking-[1px] uppercase m-0 p-0 font-bold"
              value={data.personalInfo.name}
              onChange={(v: string) => updatePersonalInfo({ name: v })}
            />
            <span className="font-normal text-[#1a4f7a] text-[24px]">|</span>
            <DirectEdit
              isPreview={isPreview}
              tagName="h3"
              className="font-semibold text-[#555555] text-[16px] m-0 p-0"
              value={data.personalInfo.title}
              onChange={(v: string) => updatePersonalInfo({ title: v })}
            />
          </div>

          <div className="font-semibold text-[#555555] uppercase text-[11px] tracking-[1px] border-b border-[#cccccc] pb-[4px] mt-[4px] mb-[8px]">
            <DirectEdit
              isPreview={isPreview}
              className="inline-block min-w-[200px]"
              value={data.personalInfo.tags}
              onChange={(v: string) => updatePersonalInfo({ tags: v })}
            />
          </div>

          <div className="flex justify-center gap-[15px] text-[11px] mt-[12px]">
            <div className="flex items-center text-[#555555]">
              <Phone size={13} className="text-[#1a4f7a] mr-[4px]" strokeWidth={2.5} />
              <DirectEdit isPreview={isPreview} value={data.personalInfo.phone} onChange={(v: string) => updatePersonalInfo({ phone: v })} />
            </div>
            <div className="flex items-center text-[#555555]">
              <Mail size={13} className="text-[#1a4f7a] mr-[4px]" strokeWidth={2.5} />
              <DirectEdit isPreview={isPreview} value={data.personalInfo.email} onChange={(v: string) => updatePersonalInfo({ email: v })} />
            </div>
            <div className="flex items-center text-[#555555]">
              <Globe size={13} className="text-[#1a4f7a] mr-[4px]" strokeWidth={2.5} />
              <DirectEdit isPreview={isPreview} value={data.personalInfo.linkedin} onChange={(v: string) => updatePersonalInfo({ linkedin: v })} />
            </div>
            <div className="flex items-center text-[#555555]">
              <Code size={13} className="text-[#1a4f7a] mr-[4px]" strokeWidth={2.5} />
              <DirectEdit isPreview={isPreview} value={data.personalInfo.github} onChange={(v: string) => updatePersonalInfo({ github: v })} />
            </div>
          </div>
        </header>
      </EditableSection>

      {/* Professional Summary */}
      <EditableSection isPreview={isPreview}>
        <section>
          <h2 className="text-[#1a4f7a] text-[14px] font-bold uppercase border-b-2 border-[#1a4f7a] mt-[12px] mb-[4px] m-0 pb-0">
            Professional Summary
          </h2>
          <div className="text-justify m-0 text-[#222222]">
            <DirectEdit
              isPreview={isPreview}
              tagName="p"
              className="inline m-0 p-0"
              value={data.personalInfo.summary}
              onChange={(v: string) => updatePersonalInfo({ summary: v })}
            />
          </div>
        </section>
      </EditableSection>

      {/* Technical Expertise */}
      <section>
        <h2 className="text-[#1a4f7a] text-[14px] font-bold uppercase border-b-2 border-[#1a4f7a] mt-[12px] mb-[4px] m-0 pb-0">
          Technical Expertise
        </h2>
        {data.skills.map((skill) => (
          <EditableSection
            key={skill.id}
            isPreview={isPreview}
            showToolbar={true}
            onMoveUp={() => moveSkill(skill.id, 'up')}
            onMoveDown={() => moveSkill(skill.id, 'down')}
            onDelete={() => removeSkill(skill.id)}
            onAdd={() => addSkill({ id: Date.now().toString(), category: 'Category', items: 'Skill 1, Skill 2' })}
          >
            <div className="mt-[2px] flex">
              <DirectEdit
                isPreview={isPreview}
                tagName="span"
                className="font-bold text-[13px] text-[#1a4f7a]"
                value={skill.category}
                onChange={(v: string) => updateSkill(skill.id, { category: v })}
              />
              <span className="font-bold text-[13px] text-[#1a4f7a] mr-[4px]">:&nbsp;</span>
              <DirectEdit
                isPreview={isPreview}
                tagName="p"
                className="inline m-0 text-[#222222] flex-1"
                value={skill.items}
                onChange={(v: string) => updateSkill(skill.id, { items: v })}
              />
            </div>
          </EditableSection>
        ))}
        {!isPreview && data.skills.length === 0 && (
          <button onClick={() => addSkill({ id: Date.now().toString(), category: 'Category', items: 'Skill 1, Skill 2' })} className="text-xs text-[rgb(250,204,21)] font-medium mt-1 flex items-center gap-1 opacity-70 hover:opacity-100">
            <PlusCircle size={12} /> Add Skill
          </button>
        )}
      </section>

      {/* Professional Experience */}
      <section>
        <h2 className="text-[#1a4f7a] text-[14px] font-bold uppercase border-b-2 border-[#1a4f7a] mt-[12px] mb-[4px] m-0 pb-0">
          Professional Experience
        </h2>
        {data.experiences.map((exp) => (
          <EditableSection
            key={exp.id}
            isPreview={isPreview}
            showToolbar={true}
            onMoveUp={() => moveExperience(exp.id, 'up')}
            onMoveDown={() => moveExperience(exp.id, 'down')}
            onDelete={() => removeExperience(exp.id)}
            onAdd={handleExpAdd}
          >
            <div>
              <div className="flex justify-between items-baseline">
                <DirectEdit isPreview={isPreview} className="text-[#1a4f7a] text-[13px] font-bold" value={exp.company} onChange={(v: string) => updateExperience(exp.id, { company: v })} />
                <DirectEdit isPreview={isPreview} className="font-semibold text-[#555555]" value={exp.date} onChange={(v: string) => updateExperience(exp.id, { date: v })} />
              </div>
              <div className="flex justify-between items-baseline">
                <DirectEdit isPreview={isPreview} className="font-semibold text-[#222222]" value={exp.role} onChange={(v: string) => updateExperience(exp.id, { role: v })} />
                <DirectEdit isPreview={isPreview} className="text-[#555555] italic" value={exp.location} onChange={(v: string) => updateExperience(exp.id, { location: v })} />
              </div>
              <ul className="mt-0 pl-[20px] mb-[12px] list-disc list-outside text-justify group/list">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="pl-1 mb-1 group/item relative marker:text-gray-500">
                    <DirectEdit isPreview={isPreview} tagName="span" className="inline m-0 p-0" value={h} onChange={(v: string) => {
                      const newH = [...exp.highlights];
                      newH[i] = v;
                      updateExperience(exp.id, { highlights: newH });
                    }} />
                    {!isPreview && (
                      <span className="opacity-0 group-hover/item:opacity-100 absolute right-0 top-0 bg-white/90 backdrop-blur-sm pl-2 py-0.5 inline-flex items-center z-50 rounded-l">
                        {i > 0 && (
                          <button
                            className="text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all p-1 rounded shadow-sm border border-gray-100 cursor-pointer mr-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newH = [...exp.highlights];
                              [newH[i - 1], newH[i]] = [newH[i], newH[i - 1]];
                              updateExperience(exp.id, { highlights: newH });
                            }}
                            title="Move up"
                          >
                            <MoveUp size={12} />
                          </button>
                        )}
                        {i < exp.highlights.length - 1 && (
                          <button
                            className="text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all p-1 rounded shadow-sm border border-gray-100 cursor-pointer mr-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newH = [...exp.highlights];
                              [newH[i], newH[i + 1]] = [newH[i + 1], newH[i]];
                              updateExperience(exp.id, { highlights: newH });
                            }}
                            title="Move down"
                          >
                            <MoveDown size={12} />
                          </button>
                        )}
                        <button
                          className="text-red-500 hover:bg-red-50 hover:text-red-700 transition-all p-1 rounded shadow-sm border border-red-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateExperience(exp.id, { highlights: exp.highlights.filter((_, idx) => idx !== i) });
                          }}
                          title="Delete highlight"
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    )}
                  </li>
                ))}
                {!isPreview && (
                  <li className="list-none opacity-0 group-hover/list:opacity-100 transition-opacity mt-1">
                    <button onClick={() => updateExperience(exp.id, { highlights: [...exp.highlights, 'New highlight'] })} className="text-[rgb(250,204,21)] flex items-center text-xs font-medium hover:underline">
                      <PlusCircle size={10} className="mr-1" /> Add bullet
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </EditableSection>
        ))}
        {!isPreview && data.experiences.length === 0 && (
          <button onClick={handleExpAdd} className="text-xs text-[rgb(250,204,21)] font-medium mt-1 flex items-center gap-1 opacity-70 hover:opacity-100">
            <PlusCircle size={12} /> Add Experience
          </button>
        )}
      </section>

      {/* Education */}
      <section>
        <h2 className="text-[#1a4f7a] text-[14px] font-bold uppercase border-b-2 border-[#1a4f7a] mt-[12px] mb-[4px] m-0 pb-0">
          Education
        </h2>
        {data.education.map((edu) => (
          <EditableSection
            key={edu.id}
            isPreview={isPreview}
            showToolbar={true}
            onMoveUp={() => moveEducation(edu.id, 'up')}
            onMoveDown={() => moveEducation(edu.id, 'down')}
            onDelete={() => removeEducation(edu.id)}
            onAdd={() => addEducation({ id: Date.now().toString(), school: 'School', degree: 'Degree', date: 'Date', location: 'Location' })}
          >
            <div className="mb-[12px]">
              <div className="flex justify-between items-baseline">
                <DirectEdit isPreview={isPreview} className="text-[#1a4f7a] text-[13px] font-bold" value={edu.school} onChange={(v: string) => updateEducation(edu.id, { school: v })} />
                <DirectEdit isPreview={isPreview} className="font-semibold text-[#555555]" value={edu.date} onChange={(v: string) => updateEducation(edu.id, { date: v })} />
              </div>
              <div className="flex justify-between items-baseline">
                <DirectEdit isPreview={isPreview} className="font-semibold text-[#222222]" value={edu.degree} onChange={(v: string) => updateEducation(edu.id, { degree: v })} />
                <DirectEdit isPreview={isPreview} className="text-[#555555] italic" value={edu.location} onChange={(v: string) => updateEducation(edu.id, { location: v })} />
              </div>
            </div>
          </EditableSection>
        ))}
        {!isPreview && data.education.length === 0 && (
          <button onClick={() => addEducation({ id: Date.now().toString(), school: 'School', degree: 'Degree', date: 'Date', location: 'Location' })} className="text-xs text-[rgb(250,204,21)] font-medium mt-1 flex items-center gap-1 opacity-70 hover:opacity-100">
            <PlusCircle size={12} /> Add Education
          </button>
        )}
      </section>

      {/* Key Achievements */}
      <section>
        <h2 className="text-[#1a4f7a] text-[14px] font-bold uppercase border-b-2 border-[#1a4f7a] mt-[12px] mb-[4px] m-0 pb-0">
          Key Achievements
        </h2>
        <ul className="mt-0 pl-[15px] mb-[12px] list-disc text-justify">
          {data.keyAchievements.map((ach) => (
            <EditableSection
              key={ach.id}
              isPreview={isPreview}
              showToolbar={true}
              onMoveUp={() => moveKeyAchievement(ach.id, 'up')}
              onMoveDown={() => moveKeyAchievement(ach.id, 'down')}
              onDelete={() => removeKeyAchievement(ach.id)}
              onAdd={() => addKeyAchievement({ id: Date.now().toString(), description: 'New Achievement' })}
            >
              <li className="m-0 p-0">
                <DirectEdit isPreview={isPreview} tagName="span" className="inline m-0 p-0" value={ach.description} onChange={(v: string) => updateKeyAchievement(ach.id, { description: v })} />
              </li>
            </EditableSection>
          ))}
        </ul>
        {!isPreview && data.keyAchievements.length === 0 && (
          <button onClick={() => addKeyAchievement({ id: Date.now().toString(), description: 'New Achievement' })} className="text-xs text-[rgb(250,204,21)] font-medium mt-1 flex items-center gap-1 opacity-70 hover:opacity-100">
            <PlusCircle size={12} /> Add Achievement
          </button>
        )}
      </section>

    </div>
  );
};
