import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authentication, firestore, storage } from "../firebase";
import Toast from "react-native-toast-message";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [registrationBuffer, setRegistrationBuffer] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(authentication, (user) => {
        if (user) {
          // Logged in..
          setUser(user);
        } else {
          // Not logged in..
          setUser(null);
        }
        //avoid jitter between pages
        setLoadingInitial(false);
      }),
    []
  );

  const registerUser = async (
    firstName,
    lastName,
    icNo,
    email,
    password,
    selectedImage,
    navigation
  ) => {
    setRegistrationBuffer(true);
    await createUserWithEmailAndPassword(authentication, email, password)
      .then(async (userCredential) => {
        if (selectedImage != null) {
          const storageRef = ref(
            storage,
            `receptionists/${userCredential.user.uid}/${userCredential.user.uid}.jpg`
          );

          //convert to blob
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", selectedImage.localUri, true);
            xhr.send(null);
          });

          await uploadBytes(storageRef, blob)
            .then(async () => {
              await getDownloadURL(ref(storage, storageRef)).then(
                async (url) => {
                  await setDoc(
                    doc(firestore, "receptionists", userCredential.user.uid),
                    {
                      firstName: firstName,
                      lastName: lastName,
                      icNo: icNo,
                      email: email,
                      password: password,
                      profilePicture: url,
                      role: "receptionist",
                      dateCreated: serverTimestamp(),
                    }
                  ).then(() => {
                    signOut(authentication).then(() => {
                      Toast.show({
                        type: "success",
                        text1: `Registration is successful`,
                        text2: "Please login with your credentials",
                        visibilityTime: 2000,
                        position: "bottom",
                        bottomOffset: 20,
                      });
                      setRegistrationBuffer(false);
                      navigation.goBack();
                    });
                  });
                }
              );
            })
            .catch((err) => {
              console.log("Error uploading to storage ", err);
            });
        } else {
          setDoc(doc(firestore, "receptionists", userCredential.user.uid), {
            firstName: firstName,
            lastName: lastName,
            icNo: icNo,
            email: email,
            password: password,
            profilePicture: null,
            role: "receptionist",
            dateCreated: serverTimestamp(),
          }).then(() => {
            signOut(authentication).then(() => {
              Toast.show({
                type: "success",
                text1: `Registration is successful`,
                text2: "Please login with your credentials",
                visibilityTime: 2000,
                position: "bottom",
                bottomOffset: 20,
              });
              setRegistrationBuffer(false);
              navigation.goBack();
            });
          });
        }
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong",
          visibilityTime: 2000,
          position: "bottom",
          bottomOffset: 20,
        });
        console.log("Error signing out upon account creation. ", error);
      });
  };

  const signInUser = async (email, password) => {
    setRegistrationBuffer(true);
    await signInWithEmailAndPassword(authentication, email, password)
      .then(async (userCredential) => {
        const receptionistsRef = doc(
          firestore,
          "receptionists",
          userCredential.user.uid
        );
        const receptionistsSnap = await getDoc(receptionistsRef);
        if (receptionistsSnap.exists()) {
          try {
            const userDetails = receptionistsSnap.data();
            const jsonValue = JSON.stringify(userDetails);
            await AsyncStorage.setItem("userDetails", jsonValue);
            setRegistrationBuffer(false);
          } catch (e) {
            // saving error
            console.log("Error saving user in AsyncStorage ", e);
          }
          // Signed in
          Toast.show({
            type: "success",
            text1: `Hi ${receptionistsSnap.data().firstName} ${
              receptionistsSnap.data().lastName
            }`,
            text2: "Welcome to Appointment Management App 👋",
            visibilityTime: 2000,
            position: "bottom",
            bottomOffset: 20,
          });
        } else {
          setRegistrationBuffer(false);
          Toast.show({
            type: "error",
            text1: "Error logging in",
            text2: "User not found",
            visibilityTime: 2000,
            position: "bottom",
            bottomOffset: 20,
          });
          console.log("No such user document!");
        }
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error logging in",
          text2: "Something went wrong",
          visibilityTime: 2000,
          position: "bottom",
          bottomOffset: 20,
        });
        console.log("Error signing in. ", error);
      });
  };

  const logoutUser = async () => {
    await signOut(authentication)
      .then(() => {
        console.log("User has successfully signed out.");
      })
      .catch((error) => {
        console.log("Error signing out user. ", error);
      });
  };

  // cache optimisation
  const memoedValue = useMemo(
    () => ({
      user,
      registrationBuffer,
      registerUser,
      signInUser,
      logoutUser,
    }),
    [user, registrationBuffer]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
