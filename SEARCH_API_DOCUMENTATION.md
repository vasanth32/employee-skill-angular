# Search API Call Documentation

## When Search Button is Clicked

### 1. Form Values Extracted
```typescript
const formValue = this.searchForm.value;
const skill = formValue.skill?.trim() || undefined;      // e.g., "Java"
const minRating = formValue.rating ? Number(formValue.rating) : undefined;  // e.g., 4
```

### 2. Validation
- If both `skill` and `minRating` are empty/undefined, the search is **NOT performed**
- At least one filter must be provided

### 3. API Call Made
**Service:** `SearchService.searchEmployees(skill, minRating)`

**HTTP Method:** `GET`

**Base URL:** `http://localhost:5112/search`

**Query Parameters:**
- `skill` (optional): String - Skill name to search for
- `minRating` (optional): Number - Minimum rating filter (1-5)

### 4. Example API Calls

#### Example 1: Search by Skill Only
**Input:**
- Skill Name: "Java"
- Minimum Rating: (empty)

**API Call:**
```
GET http://localhost:5112/search?skill=Java
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Example 2: Search by Rating Only
**Input:**
- Skill Name: (empty)
- Minimum Rating: 4

**API Call:**
```
GET http://localhost:5112/search?minRating=4
```

#### Example 3: Search by Both Skill and Rating
**Input:**
- Skill Name: "Java"
- Minimum Rating: 4

**API Call:**
```
GET http://localhost:5112/search?skill=Java&minRating=4
```

#### Example 4: Search All (No Filters)
**Input:**
- Skill Name: (empty)
- Minimum Rating: (empty)

**Result:** No API call is made (validation prevents it)

### 5. Response Format

**Success Response (200 OK):**
```json
[
  {
    "employeeId": "string",
    "name": "string",
    "role": "string",
    "skillName": "string",
    "rating": number
  }
]
```

**Example Response:**
```json
[
  {
    "employeeId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "role": "Developer",
    "skillName": "Java",
    "rating": 5
  }
]
```

### 6. Code Flow

```typescript
// 1. User clicks "Search" button
onSearch() {
  // 2. Get form values
  const skill = formValue.skill?.trim() || undefined;
  const minRating = formValue.rating ? Number(formValue.rating) : undefined;
  
  // 3. Validate (at least one filter required)
  if (!skill && !minRating) return;
  
  // 4. Call service
  searchService.searchEmployees(skill, minRating)
}

// 5. Service builds query parameters
searchEmployees(skill?: string, minRating?: number) {
  let params = new HttpParams();
  if (skill) params = params.set('skill', skill);
  if (minRating) params = params.set('minRating', minRating.toString());
  
  // 6. Make GET request
  return http.get('http://localhost:5112/search', { params });
}
```

### 7. Current Implementation Details

**Endpoint:** `GET http://localhost:5112/search`

**Query Parameters:**
- `skill` (optional): String value from "Skill Name" input field
- `minRating` (optional): Number value from "Minimum Rating" dropdown

**Request:**
- Method: GET
- Headers: Authorization Bearer token (added by interceptor)
- Query String: Built dynamically based on form values

**Response:**
- Status: 200 OK (success)
- Body: Array of `EmployeeSearchResult` objects
- Empty array if no results found

### 8. Error Handling

- **404:** Search endpoint not found
- **400:** Bad request (invalid parameters)
- **401:** Unauthorized (token expired)
- **403:** Forbidden (no permission)
- **500:** Server error
- **503:** Service unavailable

### 9. Network Tab Example

When you click Search with "Java" in skill field:

**Request URL:**
```
http://localhost:5112/search?skill=Java
```

**Request Method:**
```
GET
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Query String Parameters:**
```
skill: Java
```


