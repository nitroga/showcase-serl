import React from "react";
import { useQRCode } from "next-qrcode";
import styles from "../styles/ProjectDetail.module.css";

const ProjectDetail = ({ project }) => {
  const { Image } = useQRCode();

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.project}>
      <div className={styles.projectInfo}>
        <div className={styles.projectDetails}>
          <div className={styles.projectTags}>
            {project.tags.map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.projectDescription}>{project.description}</div>
        </div>
        <div className={styles.qrCode}>
          <Image
            text={project.URL}
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
  );
};

export default ProjectDetail;
