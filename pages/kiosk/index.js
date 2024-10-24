import { useState, useEffect } from "react";
import { useQRCode } from "next-qrcode";
import Link from "next/link";
import Head from "next/head";
import styles from "../../src/styles/Kiosk.module.css";

export default function Kiosk() {
  const intervalTime = 7000; // 7 seconds
  const [projects, setProjects] = useState([]);
  const [projectIndex, setProjectIndex] = useState(0);
  const [showTopBar, setShowTopBar] = useState(true);
  const { Image } = useQRCode();
  const domain = "http://193.11.186.245:3000"

  useEffect(() => {
    fetch("/projects.json")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const cycleInterval = setInterval(() => {
        setProjectIndex(
          (prevIndex) => (prevIndex + 1) % projects.length
        );
      }, intervalTime);

      return () => clearInterval(cycleInterval);
    }
  }, [projects, intervalTime]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 70) {
        setShowTopBar(true);
      } else {
        setShowTopBar(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const project = projects[projectIndex];

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`ShowcaseSERL - ${project.title}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.top} ${showTopBar ? styles.showTop : styles.hideTop}`}>
        <div className={styles.topText}>ShowcaseSERL</div>
          <Link href="/">
            <button className={styles.kioskButton}>Project List</button>
          </Link>
      </div>

      <div className={styles.titleAndType}>
        <div className={styles.title}>{project.title}</div>
        <div className={styles.projectType}>{project.type}</div>
      </div>

      <div className={styles.project}>
        <div className={styles.projectInfo}>
          <div className={styles.projectDetails}>
            <div className={styles.projectTags}>
              {project.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.projectDescription}>
              {project.description}
            </div>
          </div>
          <div className={styles.qrCode}>
            <Image
              text={`${domain}/project/${project.id}`}
              options={{
                margin: 2,
                width: 100,
              }}
            />
          </div>
        </div>
        <div className={styles.border}></div>
        <div className={styles.screenshots}>
          {project.screenshots.map((screenshot, index) => (
            <img
              key={index}
              src={screenshot}
              alt={`Screenshot ${index + 1}`}
              className={styles.screenshotImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}