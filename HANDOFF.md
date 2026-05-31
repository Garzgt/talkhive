# TalkHive — New Chat Handoff

## What this is
Android-only real-time chat app. Expo SDK 54 managed workflow + Supabase backend.
This file exists so a new Claude chat session can pick up exactly where the last one left off.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Expo SDK 54 (`expo ~54.0.0`) managed workflow |
| Language | JavaScript (.jsx/.js) — no TypeScript in source files |
| Navigation | React Navigation v7: native-stack + bottom-tabs |
| Backend | Supabase (Auth, Postgres, Realtime, Storage) |
| Email | Brevo API (transactional OTP emails) |
| State | React context (`AuthContext`) + module-level flags (`sessionFlags`) |
| Font | Poppins (Regular, Medium, SemiBold, Bold) |
| Icons | `@expo/vector-icons` → Ionicons |
| Platform | Android only |

**IMPORTANT**: AGENTS.md says to read docs at `https://docs.expo.dev/versions/v56.0.0/` before writing code. Follow this even though package.json says SDK 54 — it's the project rule.

---

## Project structure

```
src/
  config/
    supabase.js          ← Supabase client init
    routes.js            ← ROUTES constants
    env.js               ← EXPO_PUBLIC_* vars re-exported
  context/
    AuthContext.jsx       ← session, profile, loading, signOut, fetchProfile
  state/
    sessionFlags.js       ← { showWelcome, showLoginWelcome } — cross-navigator flags
  navigation/
    AppNavigator.jsx      ← session ? MainTabNavigator : AuthNavigator
    AuthNavigator.jsx     ← Login, Register, ForgotPassword, WelcomeTour
    MainTabNavigator.jsx  ← 5 tabs: Rooms, DMs, Search, Alerts, Profile
    ChatStackNavigator.jsx← RoomList → ChatRoom → RoomInfo
    DMStackNavigator.jsx  ← DMInbox → DMConversation
  styles/
    colors.js             ← design tokens (primary: #F97316 orange)
    fonts.js              ← font family + size + lineHeight tokens
  screens/
    Auth/
      Login.jsx           ✅ DONE
      Register.jsx        ✅ DONE
      ForgotPassword.jsx  ✅ DONE (3-step OTP flow)
      components/
        AlertModal.jsx    ✅ DONE (animated, success/error/warning)
      services/
        authService.js    ✅ DONE
        brevoService.js   ✅ DONE
    Profile/
      Profile.jsx         ✅ DONE (avatar/initials, name, logout)
      Profile.styles.js   ✅ DONE
    Rooms/
      RoomList.jsx        ⚠️  PARTIAL — has welcome modal logic, needs real room list
      RoomList.styles.js  ❌ EMPTY
      components/
        RoomCard.jsx          ❌ EMPTY
        RoomCard.styles.js    ❌ EMPTY
        CreateRoomModal.jsx   ❌ EMPTY
        CreateRoomModal.styles.js ❌ EMPTY
        RoomFilterTabs.jsx    ❌ EMPTY
        RoomFilterTabs.styles.js  ❌ EMPTY
      services/
        roomService.js    ❌ EMPTY
    Chat/
      ChatRoom.jsx        ❌ placeholder
      RoomInfo.jsx        ❌ placeholder
      ChatRoom.styles.js  ❌ EMPTY
      RoomInfo.styles.js  ❌ EMPTY
      components/         ❌ all EMPTY (ChatHeader, MessageActionSheet, etc.)
      services/
        chatService.js         ❌ EMPTY
        chatRealtimeService.js ❌ EMPTY
    DirectMessages/       ❌ all placeholders/empty
    Search/               ❌ placeholder
    Notifications/        ❌ placeholder
    Settings/             ❌ placeholder
  components/             ❌ all EMPTY (Avatar, Button, MessageBubble, etc.)
  hooks/                  ❌ all EMPTY (useRealtimeMessages, etc.)
  animations/             ❌ all EMPTY
```

---

## Supabase tables (live in prod)

### `public.profiles`
```sql
id          uuid  PK (references auth.users)
username    text  UNIQUE NOT NULL
display_name text
avatar_url  text
created_at  timestamptz DEFAULT now()
```
Auto-populated by trigger `handle_new_user()` on `auth.users` insert, reading from `raw_user_meta_data`.

### `public.password_resets`
```sql
email       text  PK
otp         text
expires_at  timestamptz
```
RLS disabled. Used by ForgotPassword 3-step flow.

### RPCs (Supabase SQL functions)
- `check_email_exists(p_email text) → bool` — checks if email exists in auth.users (SECURITY DEFINER)
- `reset_password_with_otp(p_email, p_otp, p_new_password)` — verifies OTP + calls `auth.update_user_password_by_id` (SECURITY DEFINER, uses pgcrypto via `extensions.crypt`)

### Tables NOT yet created (needed for Rooms):
```sql
-- rooms: id (uuid PK), name (text), description (text), created_by (uuid FK profiles),
--        is_public (bool default true), avatar_url (text), created_at (timestamptz)
-- room_members: room_id (uuid FK), user_id (uuid FK), role (text default 'member'),
--               joined_at (timestamptz)
-- messages: id (uuid PK), room_id (uuid FK), user_id (uuid FK), content (text),
--           type (text default 'text'), created_at (timestamptz), edited_at (timestamptz)
```
These need to be created in Supabase SQL Editor before building those screens.

---

## Env vars (`.env` in project root)
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_BREVO_API_KEY=xkeysib-...
EXPO_PUBLIC_BREVO_SENDER_EMAIL=dazukke26@gmail.com
EXPO_PUBLIC_BREVO_SENDER_NAME=TalkHive
```

---

## Coding conventions — follow these exactly

1. **Files**: `ScreenName.jsx` + `ScreenName.styles.js` side by side
2. **Services**: `screens/Feature/services/featureService.js`
3. **Components**: `screens/Feature/components/ComponentName.jsx` + `.styles.js`
4. **Styles**: `StyleSheet.create` — never inline style objects for reuse
5. **SafeAreaView**: always from `react-native-safe-area-context`
6. **Colors**: always from `../../styles/colors` (adjust `../` depth for actual location)
7. **Fonts**: always from `../../styles/fonts`
8. **Auth**: `const { session, profile, signOut } = useAuth()` from `../../context/AuthContext`
9. **No comments** unless the WHY is non-obvious
10. **No console.log** — none at all in committed code
11. **No TypeScript** in .jsx/.js files
12. **Supabase client**: `import { supabase } from "../../../config/supabase"`

---

## Key patterns in use

### useAuth
```js
const { session, profile, loading, signOut, fetchProfile } = useAuth();
// profile shape: { id, username, display_name, avatar_url, created_at }
```

### sessionFlags (cross-navigator state)
```js
import sessionFlags from "../../state/sessionFlags";
sessionFlags.showWelcome = true;       // set before navigating away from auth
sessionFlags.showLoginWelcome = true;  // checked in RoomList on mount
```

### AlertModal
```jsx
<AlertModal
  visible={bool}
  type="success" // or "error" | "warning"
  title="Title"
  message="Body text"
  onClose={() => setVisible(false)}
/>
```

### Navigation
```js
navigation.navigate(ROUTES.CHAT_ROOM, { roomId, roomName });
navigation.goBack();
navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] });
```

### Supabase query pattern
```js
const { data, error } = await supabase.from("table").select("*").eq("id", id);
if (error) throw error;
```

---

## What's done — Auth flows

| Screen | Status |
|---|---|
| Login | ✅ email+password, welcome back alert |
| Register | ✅ email+username+password, welcome alert |
| ForgotPassword | ✅ 3-step: email → 6-digit OTP (via Brevo) → new password |
| Profile | ✅ avatar/initials, display name, @username, logout |

---

## NEXT TASK: Build Rooms

This is what the new chat session should build. Start here.

### What Rooms needs:
1. **SQL in Supabase** — create `rooms`, `room_members`, `messages` tables + RLS policies
2. **`roomService.js`** — fetchRooms, createRoom, joinRoom, leaveRoom
3. **`RoomCard.jsx`** — room name, description, member count, joined indicator
4. **`RoomFilterTabs.jsx`** — "All" / "Joined" filter
5. **`CreateRoomModal.jsx`** — name + description inputs, create button
6. **`RoomList.jsx`** — header with search icon + "+" button, filter tabs, FlashList of RoomCards, FAB or modal to create room
7. **`RoomList.styles.js`** — styles for the above

### Current RoomList.jsx state (keep the welcome modal logic):
```jsx
// Lines 1-58 of src/screens/Rooms/RoomList.jsx
// Has useEffect checking sessionFlags.showWelcome / showLoginWelcome
// Shows AlertModal with welcome message
// The rest of the screen body needs to be built out
```

### Desired UX for RoomList:
- Header: "Rooms" title + search icon (right) + "+" create button (right)
- Filter tabs: All | Joined
- Room cards in a FlashList (from @shopify/flash-list)
- Each card: room name, description snippet, member count, joined badge if member
- Pull-to-refresh
- Empty state if no rooms

### ChatRoom (after RoomList is done):
- Full-screen chat with messages
- Header: back button + room name + info icon → RoomInfo
- Message list (FlashList, newest at bottom)
- Text input + send button
- Realtime via Supabase Realtime channel

---

## Build commands
```bash
npm run dev          # expo start --dev-client (requires dev build installed)
npm start            # expo start (Expo Go)
eas build --profile development --platform android  # build dev APK
```

---

## Dependency notes
All needed packages are installed:
- `@shopify/flash-list` — for message/room lists
- `react-native-gifted-chat` — available but may not be used (ChatRoom TBD)
- `react-native-reanimated` — installed + babel plugin configured
- `expo-image-picker`, `expo-file-system`, `expo-clipboard`, `expo-haptics` — all installed

---

## Last state of git
Branch: `main`
Last commit: `b855007 done`
Modified (uncommitted): AuthContext.jsx, AppNavigator.jsx, ForgotPassword.jsx, ForgotPassword.styles.js, authService.js
