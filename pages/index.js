import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Dropdown from "../src/components/Dropdown";
import ProjectList from "../src/components/ProjectList";
import styles from "../src/styles/Home.module.css";

export default function Home() {
  const intervalTime = 300000; // Interval time in milliseconds - Current: 5 minutes
  const [types, setTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const typeChange = (option) => {
    setSelectedType((prevSelectedType) =>
      prevSelectedType == option.label ? null : option.label
    );
  };

  const tagChange = (option) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(option.label)) {
        return prevSelectedTags.filter((tag) => tag != option.label);
      } else {
        return [...prevSelectedTags, option.label];
      }
    });
  };

  const resetFilters = () => {
    setSelectedType(null);
    setSelectedTags([]);
    setSearchTerm("");
    fetchProjects();
  };

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  const fetchProjects = () => {
    fetch("/projects.json")
      .then((response) => response.json())
      .then((data) => {
        let filtered = data.projects;

        if (searchTerm) {
          filtered = filtered.filter((project) =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (selectedType) {
          filtered = filtered.filter((project) => project.type == selectedType);
        }

        if (selectedTags.length > 0) {
          filtered = filtered.filter((project) =>
            selectedTags.every((tag) => project.tags.includes(tag))
          );
        }

        setFilteredProjects(filtered);
        const { types: types, tags: tags } =
          extractOptionsFromProjects(filtered);
        setTypes(types);
        setTags(tags);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, intervalTime);
    return () => clearInterval(interval);
  }, [selectedType, selectedTags, searchTerm]);

  return (
    <div className={styles.container}>
      <Head>
        <title>ShowcaseSERL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.top}>
        <div className={styles.topText}>ShowcaseSERL</div>
          <Link href="/kiosk">
            <button className={styles.kioskButton}>Kiosk Mode</button>
          </Link>
      </div>

      <div className={styles.filterDiv}>
        <div className={styles.filterTop}>
          <div className={styles.currentShown}>
            Showing {filteredProjects.length} projects
          </div>
          <button className={styles.resetFilters} onClick={resetFilters}>
            Reset filters
          </button>
        </div>
        <div className={styles.filters}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={searchChange}
          />
          <Dropdown
            name="Type"
            options={types}
            onChange={typeChange}
            selectedOption={selectedType}
          />
          <Dropdown
            name="Tags"
            options={tags}
            onChange={tagChange}
            selectedOption={selectedTags}
          />
        </div>
      </div>

      <ProjectList projects={filteredProjects} />
    </div>
  );
}

function extractOptionsFromProjects(projects) {
  const typeAmount = {};
  const tagAmount = {};

  projects.forEach((project) => {
    typeAmount[project.type] = (typeAmount[project.type] || 0) + 1;
    project.tags.forEach((tag) => {
      tagAmount[tag] = (tagAmount[tag] || 0) + 1;
    });
  });

  const sortedTypes = Object.entries(typeAmount)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, number]) => ({ label, number }));

  const sortedTags = Object.entries(tagAmount)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, number]) => ({ label, number }));

  return { types: sortedTypes, tags: sortedTags };
}
