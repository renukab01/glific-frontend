import React from 'react';
import styles from './ContactDescription.module.css';
import { Timer } from '../../../../components/UI/Timer/Timer';

export interface ContactDescriptionProps {
  fields: any;
  phoneNo: string;
  groups: any;
  lastMessage: string;
}

export const ContactDescription: React.FC<ContactDescriptionProps> = ({
  fields,
  phoneNo,
  groups,
  lastMessage,
}: ContactDescriptionProps) => {
  const groupDetails = [
    { label: 'Groups', value: groups.map((group: any) => group.label).join(', ') },
    {
      label: 'Assigned to',
      value: '',
    },
  ];

  const otherDetails = [
    { label: 'Actitvity preference', value: '' },
    {
      label: 'Location',
      value: '',
    },
    {
      label: 'Status',
      value: '',
    },
  ];
  return (
    <div className={styles.DescriptionContainer}>
      <h2 className={styles.Title}>Details</h2>
      <div className={styles.Description}>
        <span>+{phoneNo}</span>

        <div className={styles.SessionTimer}>
          <span>Session Timer</span>
          <Timer time={lastMessage}></Timer>
        </div>
      </div>

      <div className={styles.DetailBlock}>
        {groupDetails.map((group: any, index) => (
          <div key={index}>
            <span className={styles.DescriptionItem}>{group.label}</span>
            <span className={styles.DescriptionItemValue}>{group.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.DetailBlock}>
        {otherDetails.map((detail: any, index) => (
          <div key={index}>
            <span className={styles.DescriptionItem}>{detail.label}</span>
            <span className={styles.DescriptionItemValue}>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
