import { auth, provider, storage } from "../firebase";
import { SET_LOADING_STATUS, SET_USER, GET_ARTICLES } from "./actionType";


import db from "../firebase";

export function setUser(payload) {
	return {
		type: SET_USER,
		user: payload,
	};
}

export function setLoading(status) {
	return {
		type: SET_LOADING_STATUS,
		status: status,
	};
}

export function getArticles(payload, id) {
	return {
		type: GET_ARTICLES,
		payload: payload,
		id: id,
	};
}

export function signInAPI() {
	return (dispatch) => {
		auth.signInWithPopup(provider)
			.then((payload) => dispatch(setUser(payload.user)))
			.catch((err) => alert(err.message));
	};
}

export function getUserAuth() {
	return (dispatch) => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				dispatch(setUser(user));
			}
		});
	};
}
export function signOutAPI() {
	return (dispatch) => {
		auth.signOut()
			.then(() => dispatch(setUser(null)))
			.catch((err) => alert(err.message));
	};
}

export function postArticleAPI(payload) {
	return (dispatch) => {
		dispatch(setLoading(true));
		if (payload.image !== "") {
          
			const upload = storage.ref(`images/${payload.image.name}`).put(payload.image);
			upload.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					
					console.log(`Progress: ${progress}%`);
					if(snapshot.state === "RUNNING") {
						console.log(`Progress: ${progress}%`);
					}
				},
				(error) => console.log(error.code),
				async () => {
					const downloadURL = await upload.snapshot.ref.getDownloadURL();
					db.collection("articles").add({
						actor: {
							description: payload.user.email,
							title: payload.user.displayName,
							date: payload.timestamp,
							image: payload.user.photoURL,
						},
						video: payload.video,
						sharedImg: downloadURL,
						likes: {
							count: 0,
							whoLiked: [],
						},
						comments: 0,
						description: payload.description,
					});
					dispatch(setLoading(false));
		}
	  )} else if (payload.video) {
		db.collection("articles").add({
			actor: {
				description: payload.user.email,
				title: payload.user.displayName,
				date: payload.timestamp,
				image: payload.user.photoURL,
			},
			video: payload.video,
			sharedImg: "",
			likes: {
				count: 0,
				whoLiked: [],
			},
			comments: 0,
			description: payload.description,
		});
		dispatch(setLoading(false));
	}
  }
}

export function getArticlesAPI() {
	return (dispatch) => {
		dispatch(setLoading(true));
		let payload;
		let id;
		db.collection("articles")
			.orderBy("actor.date", "desc")
			.onSnapshot((snapshot) => {
				payload = snapshot.docs.map((doc) => doc.data());
				id = snapshot.docs.map((doc) => doc.id);
				dispatch(getArticles(payload, id));
			});
		dispatch(setLoading(false));
	};
}