import React, { useState, useEffect } from "react";

const USERNAME = "mhodgsonm";
const BASE_URL = "https://playground.4geeks.com/todo";

const fetchTasks = () =>
	fetch(`${BASE_URL}/users/${USERNAME}`)
		.then((resp) => resp.json())
		.then((data) => data.todos || []);

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [inputValue, setInputValue] = useState("");

	// Ensure user exists, then load tasks
	useEffect(() => {
		fetch(`${BASE_URL}/users/${USERNAME}`, { method: "POST" })
			.then(() => fetchTasks())
			.then((todos) => setTasks(todos))
			.catch((err) => console.error("Init error:", err));
	}, []);

	const addTask = (e) => {
		e.preventDefault();
		const label = inputValue.trim();
		if (!label) return;

		fetch(`${BASE_URL}/todos/${USERNAME}`, {
			method: "POST",
			body: JSON.stringify({ label, is_done: false }),
			headers: { "Content-Type": "application/json" },
		})
			.then(() => fetchTasks())
			.then((todos) => setTasks(todos))
			.then(() => setInputValue(""))
			.catch((err) => console.error("Add error:", err));
	};

	const deleteTask = (id) => {
		fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" })
			.then(() => fetchTasks())
			.then((todos) => setTasks(todos))
			.catch((err) => console.error("Delete error:", err));
	};

	const clearAll = () => {
		Promise.all(tasks.map((task) => fetch(`${BASE_URL}/todos/${task.id}`, { method: "DELETE" })))
			.then(() => setTasks([]))
			.catch((err) => console.error("Clear error:", err));
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h1 className="text-center mb-4">Todo List</h1>

			<form onSubmit={addTask} className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Add a new task..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button className="btn btn-primary" type="submit">
					Add
				</button>
			</form>

			<ul className="list-group mb-3">
				{tasks.length === 0 ? (
					<li className="list-group-item text-muted text-center">
						No tasks yet. Add one above!
					</li>
				) : (
					tasks.map((task) => (
						<li
							key={task.id}
							className="list-group-item d-flex justify-content-between align-items-center"
						>
							<span>{task.label}</span>
							<button
								className="btn btn-sm btn-danger"
								onClick={() => deleteTask(task.id)}
							>
								&times;
							</button>
						</li>
					))
				)}
			</ul>

			{tasks.length > 0 && (
				<div className="text-end">
					<button className="btn btn-outline-danger btn-sm" onClick={clearAll}>
						Clear all tasks
					</button>
				</div>
			)}

			<p className="text-muted text-center mt-3">
				{tasks.length} task{tasks.length !== 1 ? "s" : ""} remaining
			</p>
		</div>
	);
};

export default Home;
