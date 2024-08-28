import { useState } from 'react';
import * as Yup from 'yup';
import { DialogBox } from 'components/UI/DialogBox/DialogBox';
import { AutoComplete } from 'components/UI/Form/AutoComplete/AutoComplete';
import { useMutation, useQuery } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import { FILTER_COLLECTIONS } from 'graphql/queries/Collection';
import { Loading } from 'components/UI/Layout/Loading/Loading';
import { Checkbox } from 'components/UI/Form/Checkbox/Checkbox';
import { Field, Form, Formik } from 'formik';
import { UPLOAD_CONTACTS_SAMPLE } from 'config';
import { IMPORT_CONTACTS } from 'graphql/mutations/Contact';
import { getUserSession } from 'services/AuthService';
import { setNotification } from 'common/notification';
import styles from './UploadContactsDialog.module.css';
import { ImportButton } from 'components/UI/ImportButton/ImportButton';

export interface UploadContactsDialogProps {
  organizationDetails?: any;
  setDialog: Function;
  setShowStatus: any;
}

export const UploadContactsDialog = ({ setDialog, setShowStatus }: UploadContactsDialogProps) => {
  const [fileName, setFileName] = useState<string>('');
  const [csvContent, setCsvContent] = useState<String | null | ArrayBuffer>('');
  const [uploadingContacts, setUploadingContacts] = useState(false);
  const orgId = getUserSession('organizationId');

  const { t } = useTranslation();
  const [collection] = useState();
  const [optedIn] = useState(false);

  const { data: collections, loading } = useQuery(FILTER_COLLECTIONS, {
    variables: {
      filter: {
        groupType: 'WABA',
      },
      opts: {
        limit: 50,
        offset: 0,
        order: 'ASC',
      },
    },
  });

  const [importContacts] = useMutation(IMPORT_CONTACTS, {
    onCompleted: (data: any) => {
      const { errors } = data.importContacts;
      if (errors) {
        setNotification(data.errors[0].message, 'warning');
      } else {
        setUploadingContacts(false);
        setShowStatus(true);
      }
    },
    onError: (errors) => {
      setDialog(false);
      setNotification(errors.message, 'warning');
      setUploadingContacts(false);
    },
  });

  const uploadContacts = (details: any) => {
    importContacts({
      variables: {
        type: 'DATA',
        data: csvContent,
        groupLabel: details.collection.label,
        importContactsId: orgId,
      },
    });
  };

  if (loading || !collections) {
    return <Loading />;
  }

  const validationSchema = Yup.object().shape({
    collection: Yup.object().nullable().required(t('Collection is required')),
    optedIn: Yup.boolean()
      .oneOf([true], 'Please confirm if contacts are opted in.')
      .required('Please confirm if contacts are opted in.'),
  });

  const formFieldItems: any = [
    {
      component: AutoComplete,
      name: 'collection',
      placeholder: t('Select collection'),
      options: collections.groups,
      multiple: false,
      optionLabel: 'label',
      label: t('Collection'),
    },
    {
      component: Checkbox,
      name: 'optedIn',
      title: t('Are these contacts opted in?'),
      darkCheckbox: true,
      info: {
        title: 'Please obtain prior consent from contacts to message them on WhatsApp',
      },
    },
  ];

  const form = (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{ collection, optedIn }}
      onSubmit={(itemData) => {
        uploadContacts(itemData);
        setUploadingContacts(true);
      }}
    >
      {({ submitForm }) => (
        <Form data-testid="formLayout">
          <DialogBox
            titleAlign="left"
            title={t('Upload Contacts')}
            handleOk={() => {
              submitForm();
            }}
            handleCancel={() => {
              setDialog(false);
            }}
            skipCancel
            buttonOkLoading={uploadingContacts}
            buttonOk={t('Upload')}
            alignButtons="left"
            disableOk={!csvContent}
          >
            <div className={styles.Fields}>
              {formFieldItems.map((field: any) => (
                <Field {...field} key={field.name} />
              ))}
            </div>

            <div className={styles.ImportContainer}>
              <ImportButton
                id={'uploadcontacts'}
                title={fileName || 'Select file'}
                afterImport={(result: string, media: any) => {
                  setFileName(media.name);
                  setCsvContent(result);
                }}
              />
            </div>
            <div className={styles.Sample}>
              <a href={UPLOAD_CONTACTS_SAMPLE}>Download Sample</a>
            </div>
          </DialogBox>
        </Form>
      )}
    </Formik>
  );

  return <>{form}</>;
};

export default UploadContactsDialog;
