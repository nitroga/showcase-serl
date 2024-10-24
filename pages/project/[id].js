import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ProjectDetail from "../../src/components/ProjectDetail";
import styles from "../../src/styles/ProjectDetail.module.css";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [menuOpen, setMenuOpen] = useState(false);
  const [project, setProject] = useState(null);

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (id) {
      fetch("/projects.json")
        .then((response) => response.json())
        .then((data) => {
          const selectedProject = data.projects.find((p) => p.id === Number(id));
          setProject(selectedProject);
        })
        .catch((error) => {
          console.error("Error fetching project:", error);
        });
    }
  }, [id]);

  if (!project) {
    return (
      <div style={{ textAlign: "center"}}>
        <div style={{ color: 'blue', fontWeight: 'bold', fontSize: '20px', padding: '10px' }}>
          Loading...
        </div>
        <div>ID probably not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`ShowcaseSERL - ${project.title}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.top}>
        <div className={styles.topText}>ShowcaseSERL</div>
        <div className={styles.buttonContainer}>
          <Link href="/kiosk">
            <button className={styles.kioskButton}>Kiosk Mode</button>
          </Link>
          <Link href="/">
            <button className={styles.kioskButton}>Project List</button>
          </Link>
        </div>
      </div>

      <div className={styles.titleAndType}>
        <div className={styles.title}>{project.title}</div>
        <div className={styles.projectType}>{project.type}</div>
      </div>

      <ProjectDetail project={project} />
    </div>
  );
}
