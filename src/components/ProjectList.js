import React, { useEffect } from "react";
import Link from 'next/link';
import styles from "../styles/ProjectList.module.css";

const ProjectList = ({ projects }) => {
  return (
    <div className={styles.projects}>
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <div key={index} className={styles.projectContainer}>
            <div className={styles.projectImage}>
              <img src={project.screenshots[0]} alt={`${project.title} Image`}/>
            </div>

            <div className={styles.projectContent}>
            <Link href={`/project/${project.id}`} className={styles.projectTitle}>{project.title}</Link>

              <div className={styles.projectDescription}>{project.description}</div>

              <div className={styles.projectInfo}>
                <div className={styles.type}>{project.type}</div>
                <div className={styles.projectTags}>
                  {project.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{ fontSize: '3vh', textAlign: "center"}}>No projects found matching your search!<br></br>Try another search</p>
      )}
    </div>
  );
};

export default ProjectList;