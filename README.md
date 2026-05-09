# EduLearn – Online Oktatási Platform

EduLearn egy online tanulást támogató webalkalmazás, amelyet React (frontend) és PHP + MySQL (backend) kombinációjával fejlesztettem. A felhasználók kurzusokra iratkozhatnak fel, leckéket tekinthetnek meg, és nyomon követhetik a saját haladásukat. A tanárok kurzusokat és leckéket hozhatnak létre és kezelhetnek.

---

## Technológiai stack

| Réteg | Technológia |
|---|---|
| Frontend | React 19, React Router v7, Tailwind CSS v4 |
| Ikonok | Lucide React |
| Autentikáció | Firebase Authentication |
| Backend | PHP 8.2 (REST API) |
| Adatbázis | MySQL / MariaDB 10.4 |
| Szerver | XAMPP (Apache + MySQL) |

---

## Funkciók

### Felhasználói szerepkörök

- **Vendég** – Regisztráció nélkül böngészhet az elérhető kurzusok között, de nem iratkozhat fel és nem látja a tartalmakat.
- **Diák** – Feliratkozhat kurzusokra, megtekintheti a leckéket, jelölheti befejezettnek őket, és nyomon követheti a haladását.
- **Tanár** – Kurzusokat hozhat létre és kezelhet, leckéket adhat hozzá és törölhet. (Tanári státuszt csak adatbázisban lehet beállítani profilokhoz -> a(z) users táblában szerkeszteni kell az adott profil role részét tanár státuszra)

### Főbb funkciók

- Firebase-alapú regisztráció és bejelentkezés (session-szintű perzisztenciával)
- Vendég belépési lehetőség regisztráció nélkül
- Kurzusok böngészése kereséssel és szűréssel
- Feliratkozás kurzusokra, duplikáció ellenőrzéssel
- Leckék megtekintése és befejezettnek jelölése
- Haladás nyomon követése (százalékos sáv és leckeszámláló)
- Dashboard a legutóbb aktív kurzusokkal és összesített statisztikákkal
- Kurzus létrehozása (cím, borítókép URL, háttérszín választó)
- Leckék hozzáadása és törlése (tanároknak)
- Szerepkör-alapú navigáció és védett útvonalak

---

## Projekt struktúra

```
szakdolgozat_project/
├── backend/                    # PHP REST API végpontok
│   ├── add_lesson.php
│   ├── create_course.php
│   ├── delete_lesson.php
│   ├── enroll_course.php
│   ├── get_active_courses.php
│   ├── get_course_details.php
│   ├── get_courses.php
│   ├── get_lessons.php
│   ├── get_my_enrolled_courses.php
│   ├── get_stats.php
│   ├── get_teacher_courses.php
│   ├── get_user_profile.php
│   ├── register_user.php
│   └── update_lesson.php
├── database/
│   └── edulearn_db.sql         # Adatbázis séma és minta adatok
├── public/                     # Statikus fájlok (favicon, index.html)
├── src/
│   ├── components/             # React komponensek
│   │   ├── AllCourses.jsx      # Összes elérhető kurzus böngészése
│   │   ├── Assignments.jsx     # Feladatok oldal (placeholder)
│   │   ├── Calendar.jsx        # Naptár oldal (placeholder)
│   │   ├── CourseCard.jsx      # Újrafelhasználható kurzus kártya
│   │   ├── CoursePage.jsx      # Kurzus részletező oldal + leckekezelés
│   │   ├── CreateCourse.jsx    # Új kurzus létrehozása (tanároknak)
│   │   ├── Dashboard.jsx       # Diák főoldal, statisztikákkal
│   │   ├── Login.jsx           # Bejelentkezési oldal
│   │   ├── Messages.jsx        # Üzenetek oldal (placeholder)
│   │   ├── MyCourses.jsx       # Saját kurzusok (diáknak és tanárnak)
│   │   ├── Navigation.jsx      # Felső navigációs sáv
│   │   ├── Register.jsx        # Regisztrációs oldal
│   │   └── Sidebar.jsx         # Bal oldali navigációs sáv
│   ├── context/
│   │   └── AuthContext.js      # Globális autentikációs kontextus
│   ├── App.js                  # Fő app komponens és útvonalak
│   └── firebase.js             # Firebase konfiguráció
└── package.json
```

---

## Adatbázis séma

Az alkalmazás 5 táblát használ:

- **users** – Felhasználói adatok (Firebase UID, email, teljes név, szerepkör)
- **courses** – Kurzusok (cím, oktató, borítókép, szín)
- **lessons** – Leckék (kurzushoz rendelve, cím, tartalom)
- **enrollments** – Kurzus feliratkozások (felhasználó ↔ kurzus kapcsolat, utolsó aktivitással)
- **user_progress** – Egyéni lecke-befejezések (felhasználó ↔ lecke kapcsolat)

---

## Telepítés és futtatás

### Előfeltételek

- [Node.js](https://nodejs.org/) (v18+)
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL)
- [Firebase projekt](https://console.firebase.google.com/) (Authentication bekapcsolva, Email/Password provider)

### 1. Adatbázis beállítása

1. Indítsd el a XAMPP-ot, és kapcsold be az **Apache** és **MySQL** szolgáltatásokat.
2. Nyisd meg a [phpMyAdmin](http://localhost/phpmyadmin) felületet.
3. Hozz létre egy új adatbázist `edulearn_db` névvel.
4. Importáld a `database/edulearn_db.sql` fájlt.

### 2. PHP backend beállítása

1. Másold a `backend/` mappát a XAMPP `htdocs` könyvtárába, `edulearn_api` névvel:
   ```
   C:\xampp\htdocs\edulearn_api\
   ```
2. Ellenőrizd, hogy az adatbázis kapcsolati adatok helyesek minden PHP fájlban:
   ```php
   $conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
   ```
   Ha a MySQL jelszavad nem üres, írd be a harmadik paraméterként.

### 3. Firebase konfiguráció

1. A [Firebase Console](https://console.firebase.google.com/)-ban hozz létre egy projektet, és kapcsold be az **Email/Password** autentikációs providert.
2. A projekt beállításainál másold ki a webes konfiguráció adatait.
3. Cseréld le a `src/firebase.js` fájlban lévő értékeket a sajátjaiddal:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     ...
   };
   ```

### 4. React frontend indítása

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm start
```

Az alkalmazás a [http://localhost:3000](http://localhost:3000) címen érhető el.

---

## API végpontok

Minden végpont a `http://localhost/edulearn_api/` alap URL-en érhető el.

| Végpont | Metódus | Leírás |
|---|---|---|
| `get_courses.php?uid={uid}` | GET | Összes kurzus lekérése (feliratkozás állapottal) |
| `get_active_courses.php?uid={uid}` | GET | Legutóbb aktív 3 kurzus (Dashboard) |
| `get_my_enrolled_courses.php?uid={uid}` | GET | Feliratkozott kurzusok listája |
| `get_teacher_courses.php?uid={uid}` | GET | Tanár saját kurzusai |
| `get_course_details.php?course_id={id}&uid={uid}` | GET | Kurzus adatai és leckéi haladással |
| `get_lessons.php?id={course_id}&uid={uid}` | GET | Leckék listája haladással |
| `get_stats.php?uid={uid}` | GET | Felhasználói statisztikák |
| `get_user_profile.php?uid={uid}` | GET | Felhasználói profil adatok |
| `create_course.php` | POST | Új kurzus létrehozása |
| `enroll_course.php` | POST | Kurzusra feliratkozás |
| `add_lesson.php` | POST | Új lecke hozzáadása |
| `update_lesson.php` | POST | Lecke befejezettségi állapot frissítése |
| `delete_lesson.php` | POST | Lecke törlése |
| `register_user.php` | POST | Új felhasználó mentése MySQL-be (regisztrációkor) |

---

## Tesztelési adatok

Az `edulearn_db.sql` fájl tartalmaz minta adatokat. Ezzel a két tesztfiókkal lehet bejelentkezni (jelszavakat a Firebase Console-ban kell beállítani vagy újakat létrehozni):

| Email | Szerepkör | Megjegyzés |
|---|---|---|
| teszt1@gmail.com | Diák | Több kurzusra feliratkozott |
| teszt4@gmail.com | Tanár | Létrehozott kurzusokkal |

Vendégként az **„Folytatás vendégként"** gombbal is be lehet lépni.

---

## Ismert korlátok és tervezett fejlesztések

- A **Feladatok**, **Üzenetek** és **Naptár** oldalak jelenleg placeholder tartalommal rendelkeznek, funkcionalitásuk még nem készült el.
- A profil- és beállítások menüpontok egyelőre nem aktívak.
- A PHP backend jelenleg nem használ autentikációs tokent az API hívásokhoz (fejlesztési célból).