package db

type BaseModel interface {
	Id() int
}

type User struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	PasswordHash string `json:"passwordHash"`
}

type PersonalInfo struct {
	Name     string   `json:"name"`
	Title    string   `json:"title"`
	Phone    string   `json:"phone"`
	Email    string   `json:"email"`
	LinkedIn string   `json:"linkedin"`
	Github   string   `json:"github"`
	Tags     string   `json:"tags"`
	Summary  string   `json:"summary"`
}

type Experience struct {
	ID         string   `json:"id"`
	Company    string   `json:"company"`
	Role       string   `json:"role"`
	Date       string   `json:"date"`
	Location   string   `json:"location"`
	Highlights []string `json:"highlights"`
}

type Education struct {
	ID       string `json:"id"`
	Degree   string `json:"degree"`
	School   string `json:"school"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

type Skill struct {
	ID       string `json:"id"`
	Category string `json:"category"`
	Items    string `json:"items"`
}

type Achievement struct {
	ID          string `json:"id"`
	Description string `json:"description"`
}

type Resume struct {
	BaseModel       `json:"-"`
	ID              int           `json:"id"`
	PersonalInfo    PersonalInfo  `json:"personalInfo"`
	Experiences     []Experience  `json:"experiences"`
	Education       []Education   `json:"education"`
	Skills          []Skill       `json:"skills"`
	KeyAchievements []Achievement `json:"keyAchievements"`
}

type SkillEvidence struct {
	Skill       string `json:"skill"`
	Company     string `json:"company"`
	Description string `json:"description"`
}

func (r *Resume) Id() int {
	return r.ID
}

type JD struct {
	BaseModel
	id int
}

func (j *JD) Id() int {
	return j.id
}
