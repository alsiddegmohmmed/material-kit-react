// // src/components/Auth.tsx
// import React, { useState } from "react";
// import { auth } from "../firebaseConfig";
// import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";

// const Auth: React.FC = () => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [isSignUp, setIsSignUp] = useState<boolean>(false);

//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(auth, provider);
//       console.log("Signed in with Google");
//     } catch (error) {
//       console.error("Error signing in with Google:", error);
//     }
//   };

//   const handleEmailSignIn = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       if (isSignUp) {
//         await createUserWithEmailAndPassword(auth, email, password);
//         console.log("User signed up");
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//         console.log("User signed in");
//       }
//     } catch (error) {
//       console.error("Error with email sign in:", error);
//     }
//   };

//   return (
//     <div>
//       <Button variant="contained" onClick={handleGoogleSignIn}>
//         Sign in with Google
//       </Button>
//       <form onSubmit={handleEmailSignIn}>
//         <TextField
//           type="email"
//           label="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <TextField
//           type="password"
//           label="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <Button type="submit" variant="contained">
//           {isSignUp ? "Sign Up" : "Sign In"}
//         </Button>
//       </form>
//       <Button onClick={() => setIsSignUp(!isSignUp)}>
//         {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
//       </Button>
//     </div>
//   );
// };

// export default Auth;
