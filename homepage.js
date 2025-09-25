// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
	getAuth,
	GoogleAuthProvider,
	signOut,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
	getFirestore,
	getDoc,
	doc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBImYLXCK9Npz5zYj4JhNd9WVPbwoSTkLU",
  authDomain: "openidconnect-1933b.firebaseapp.com",
  projectId: "openidconnect-1933b",
  storageBucket: "openidconnect-1933b.firebasestorage.app",
  messagingSenderId: "467994247622",
  appId: "1:467994247622:web:09207e1827d62bedfc32c7"
};

// Inicializa o Firebase
const _app = initializeApp(firebaseConfig);
const auth = getAuth(); //configura o firebase authentication
const db = getFirestore(); //configura o firestore

//monitora o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
	//busca o id do usuário autenticado salvo no localStorage
	const loggedInUserId = localStorage.getItem("loggedInUserId");

	//se o ID estiver no localStorage, tenta obter os dados do Firestore
	if (loggedInUserId) {
		const docRef = doc(db, "users", loggedInUserId); //referência ao documento do usuário no firestore

		getDoc(docRef) //Busca o documento
			.then((docSnap) => {
				//se o documento existir, exibe os dados na interface
				if (docSnap.exists()) {
					if (!user.photoURL) {
						const audio = new Audio("b.mp3");
						audio.play();
					}

					const imgSafe =
						"";

					const userData = docSnap.data();
					// console.log(userData)
					document.getElementById("welcomeName").innerText +=
						` ${userData.firstName.replace(" ", "")}!`;
					document.getElementById("loggedUserFName").innerText =
						userData.firstName;
					document.getElementById("loggedUserEmail").innerText = userData.email;
					document.getElementById("loggedUserLName").innerText =
						userData.lastName;
					document.getElementById("loggedUserDisplayName").innerText =
						user.displayName ?? userData.firstName.replace(" ", "");
					document
						.getElementById("loggedUserPhoto")
						.setAttribute("src", user.photoURL ?? imgSafe);
				} else {
					console.log("ID não encontrado no Documento");
				}
			})
			.catch((error) => {
				console.log("documento não encontrado");
			});
	} else {
		console.log("ID de usuário não encontrado no localStorage");
	}
});

//Lógica de Logout
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
	localStorage.removeItem("loggedInUserId"); //remove o ID do LocalStorage
	signOut(auth) //realiza logout
		.then(() => {
			window.location.href = "index.html"; //redireciona para a página de login
		})
		.catch((error) => {
			console.error("Error Signing out:", error);
		});
});
