import styles from "../styles/SearchBar.module.css";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <form className={`${styles.searchbar}`}>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
        className="form-control"
      />
      <button className="btn btn-primary">Search</button>
    </form>
  );
}
