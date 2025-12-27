# הוראות שימוש - שבלונות Insomnia לניהול משתמשים וקטגוריות

## איך לייבא את הקובץ ל-Insomnia:

1. פתח את Insomnia
2. לחץ על **Create** או **+** ליצירת אוסף חדש
3. לחץ על **Import/Export** (שלוש נקודות או תפריט)
4. בחר **Import Data** > **From File**
5. בחר את הקובץ `Insomnia_Users_Collection.json`

---

## רשימת הבקשות הזמינות:

### 1. Register User (POST)
**URL:** `http://localhost:3000/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "יוסי כהן",
  "email": "yossi@example.com",
  "userName": "yossi123",
  "pass": "password123"
}
```

**תגובה מוצלחת:**
```json
{
  "message": "user added successfully",
  "user": {
    "id": 1,
    "name": "יוסי כהן",
    "email": "yossi@example.com",
    "userName": "yossi123"
  }
}
```

---

### 2. Login User (POST)
**URL:** `http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userName": "yossi123",
  "pass": "password123"
}
```

**תגובה מוצלחת:**
```json
{
  "message": "user logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "יוסי כהן",
    "email": "yossi@example.com",
    "userName": "yossi123"
  }
}
```

**⚠️ חשוב:** העתק את ה-`token` מהתגובה ושמור אותו לשימוש בבקשות הבאות!

---

### 3. Get All Users (GET)
**URL:** `http://localhost:3000/users`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**תגובה מוצלחת:**
```json
{
  "message": "ok",
  "users": [
    {
      "id": 1,
      "name": "יוסי כהן",
      "email": "yossi@example.com",
      "useName": "yossi123"
    }
  ]
}
```

---

### 4. Get User By ID (GET)
**URL:** `http://localhost:3000/users/:id`

**דוגמה:** `http://localhost:3000/users/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**תגובה מוצלחת:**
```json
{
  "message": "ok",
  "user": {
    "id": 1,
    "name": "יוסי כהן",
    "email": "yossi@example.com",
    "useName": "yossi123"
  }
}
```

---

### 5. Update User (PATCH)
**URL:** `http://localhost:3000/users/:id`

**דוגמה:** `http://localhost:3000/users/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "name": "יוסי כהן מעודכן",
  "email": "yossi.updated@example.com"
}
```

**⚠️ ניתן לעדכן רק:** `name` ו-`email`

**דורש:** JWT Token (authentication)

**תגובה מוצלחת:**
```json
{
  "message": "user updated successfully"
}
```

---

### 6. Delete User (DELETE)
**URL:** `http://localhost:3000/users/:id`

**דוגמה:** `http://localhost:3000/users/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**תגובה מוצלחת:**
```json
{
  "message": "user deleted successfully"
}
```

---

## API לניהול קטגוריות:

### 1. Add Category (POST)
**URL:** `http://localhost:3000/categories`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "name": "עבודה"
}
```

**דורש:** JWT Token (authentication)

**תגובה מוצלחת:**
```json
{
  "message": "category added successfully",
  "category": {
    "id": 1,
    "name": "עבודה",
    "user_id": 1
  }
}
```

**⚠️ שדה חובה:** `name` - שם הקטגוריה

---

### 2. Get All Categories (GET)
**URL:** `http://localhost:3000/categories`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**⚠️ חשוב:** מחזיר רק את הקטגוריות של המשתמש המחובר!

**תגובה מוצלחת:**
```json
{
  "message": "ok",
  "categories": [
    {
      "id": 1,
      "name": "עבודה",
      "user_id": 1
    },
    {
      "id": 2,
      "name": "בית",
      "user_id": 1
    }
  ]
}
```

---

### 3. Get Category By ID (GET)
**URL:** `http://localhost:3000/categories/:id`

**דוגמה:** `http://localhost:3000/categories/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**⚠️ חשוב:** מחזיר קטגוריה רק אם היא שייכת למשתמש המחובר!

**תגובה מוצלחת:**
```json
{
  "message": "ok",
  "category": {
    "id": 1,
    "name": "עבודה",
    "user_id": 1
  }
}
```

---

### 4. Update Category (PATCH)
**URL:** `http://localhost:3000/categories/:id`

**דוגמה:** `http://localhost:3000/categories/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "name": "עבודה - מעודכן"
}
```

**דורש:** JWT Token (authentication)

**⚠️ שדה חובה:** `name` - שם הקטגוריה החדש

**תגובה מוצלחת:**
```json
{
  "message": "category updated successfully"
}
```

---

### 5. Delete Category (DELETE)
**URL:** `http://localhost:3000/categories/:id`

**דוגמה:** `http://localhost:3000/categories/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**⚠️ חשוב:** מוחק קטגוריה רק אם היא שייכת למשתמש המחובר!

**תגובה מוצלחת:**
```json
{
  "message": "category deleted successfully"
}
```

---

## API לניהול משימות (Tasks):

### 1. Add Task (POST)
**URL:** `http://localhost:3000/tasks`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "description": "לסיים את הפרויקט",
  "isDone": 0,
  "category_id": 1
}
```

**דורש:** JWT Token (authentication)

**⚠️ שדות חובה:**
- `description` - תיאור המשימה
- `isDone` - האם המשימה הושלמה (0 = לא הושלמה, 1 = הושלמה)
- `category_id` - ID של הקטגוריה (חייב להיות קטגוריה של המשתמש המחובר)

**תגובה מוצלחת:**
```json
{
  "message": "task added successfully",
  "task": {
    "id": 1,
    "description": "לסיים את הפרויקט",
    "isDone": 0,
    "category_id": 1,
    "user_id": 1
  }
}
```

---

### 2. Get All Tasks (GET)
**URL:** `http://localhost:3000/tasks`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**⚠️ חשוב:** מחזיר רק את המשימות של המשתמש המחובר!

**תגובה מוצלחת:**
```json
{
  "message": "ok",
  "tasks": [
    {
      "id": 1,
      "description": "לסיים את הפרויקט",
      "isDone": 0,
      "category_id": 1,
      "user_id": 1
    },
    {
      "id": 2,
      "description": "לקנות חלב",
      "isDone": 1,
      "category_id": 2,
      "user_id": 1
    }
  ]
}
```

---

### 3. Get Task By ID (GET)
**URL:** `http://localhost:3000/tasks/:id`

**דוגמה:** `http://localhost:3000/tasks/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**⚠️ חשוב:** מחזיר משימה רק אם היא שייכת למשתמש המחובר!

**תגובה מוצלחת:**
```json
{
  "message": "ok",
  "task": {
    "id": 1,
    "description": "לסיים את הפרויקט",
    "isDone": 0,
    "category_id": 1,
    "user_id": 1
  }
}
```

---

### 4. Delete Task (DELETE)
**URL:** `http://localhost:3000/tasks/:id`

**דוגמה:** `http://localhost:3000/tasks/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**דורש:** JWT Token (authentication)

**⚠️ חשוב:** מוחק משימה רק אם היא שייכת למשתמש המחובר!

**תגובה מוצלחת:**
```json
{
  "message": "task deleted successfully"
}
```

---

## טיפים:

1. **שימוש ב-Environment Variables ב-Insomnia:**
   - יצירת משתנה `jwt_token` באוסף
   - לאחר Login, העתק את ה-token והכנס אותו למשתנה
   - בכל בקשה שמצריכה authentication, השתמש ב: `Bearer {{ jwt_token }}`

2. **סדר הפעולות המומלץ:**

   **למשתמשים:**
   1. Register User - יצירת משתמש חדש
   2. Login User - קבלת JWT token
   3. Get All Users - בדיקה שכל המשתמשים נראים
   4. Get User By ID - בדיקת משתמש ספציפי
   5. Update User - עדכון פרטי משתמש
   6. Delete User - מחיקת משתמש (אם צריך)

   **לקטגוריות:**
   1. Login User - התחברות לקבלת JWT token (אם עדיין לא התחברת)
   2. Add Category - יצירת קטגוריה חדשה
   3. Get All Categories - בדיקה שכל הקטגוריות נראות
   4. Get Category By ID - בדיקת קטגוריה ספציפית
   5. Update Category - עדכון שם קטגוריה
   6. Delete Category - מחיקת קטגוריה (אם צריך)

   **למשימות:**
   1. Login User - התחברות לקבלת JWT token (אם עדיין לא התחברת)
   2. Add Category - יצירת קטגוריה (חובה לפני יצירת משימה)
   3. Add Task - יצירת משימה חדשה (חייב להזין category_id תקין)
   4. Get All Tasks - בדיקה שכל המשימות נראות
   5. Get Task By ID - בדיקת משימה ספציפית
   6. Delete Task - מחיקת משימה (אם צריך)

3. **Port:** אם השרת רץ על פורט אחר, שנה את ה-URL בהתאם (ברירת המחדל: 3000)

4. **שדות חובה:**

   **ל-Register:**
   - `name` - שם מלא
   - `email` - כתובת אימייל (חייב להיות ייחודי)
   - `userName` - שם משתמש (חייב להיות ייחודי)
   - `pass` - סיסמה

   **ל-Add Task:**
   - `description` - תיאור המשימה
   - `isDone` - האם המשימה הושלמה (0/1 או false/true)
   - `category_id` - ID של הקטגוריה (חייב להיות קטגוריה תקינה של המשתמש)

---

## שגיאות נפוצות:

### למשתמשים:
- **400 - Bad Request:** חסרים שדות חובה או email/userName כבר קיים
- **401 - Unauthorized:** חסר או לא תקין JWT token
- **404 - Not Found:** ID משתמש לא נמצא
- **500 - Internal Server Error:** שגיאת שרת

### לקטגוריות:
- **400 - Bad Request:** חסר שדה `name` או שם ארוך מדי (יותר מ-255 תווים)
- **401 - Unauthorized:** חסר או לא תקין JWT token
- **404 - Not Found:** ID קטגוריה לא נמצא או הקטגוריה לא שייכת למשתמש המחובר
- **500 - Internal Server Error:** שגיאת שרת

### למשימות:
- **400 - Bad Request:** חסרים שדות חובה (description, isDone, category_id)
- **401 - Unauthorized:** חסר או לא תקין JWT token
- **404 - Not Found:** ID משימה לא נמצא או המשימה לא שייכת למשתמש המחובר
- **500 - Internal Server Error:** שגיאת שרת

**⚠️ הערות חשובות:**
- כל פעולות הקטגוריות והמשימות דורשות authentication והן מוגבלות למשתמש המחובר בלבד
- לא ניתן לראות או לשנות קטגוריות/משימות של משתמשים אחרים
- לפני יצירת משימה, יש ליצור קטגוריה קודם (או להשתמש ב-category_id של קטגוריה קיימת)
- שדה `isDone` יכול להיות: `0` או `false` (לא הושלמה), `1` או `true` (הושלמה)

