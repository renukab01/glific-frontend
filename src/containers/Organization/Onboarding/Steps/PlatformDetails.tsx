import { Input } from 'components/UI/Form/Input/Input';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { PhoneInput } from 'components/UI/Form/PhoneInput/PhoneInput';
import { FormLayout } from '../FormLayout/FormLayout';
import { useEffect, useState } from 'react';

import styles from '../FormLayout/FormLayout.module.css';
import { FormStepProps } from './OrgDetails';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import InfoIcon from 'assets/images/info.svg?react';
import axios from 'axios';
import { ONBOARD_URL_SETUP } from 'config';

export const PlatformDetails = ({ handleStepChange, saveData }: FormStepProps) => {
  const { t } = useTranslation();
  const [name, setOrgName] = useState<string>('');
  const [app_name, setAppName] = useState<string>('');
  const [api_key, setApiKeys] = useState<string>('');
  const [shortcode, setShortcode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .required('Organisation Name is required.')
      .max(40, 'Name should not exceed 40 characters'),
    app_name: Yup.string().required('App name is required.'),
    api_key: Yup.string().required('API key is required.'),
    shortcode: Yup.string().required('Shortcode is required.'),
    phone: Yup.string().required('Phone number is required.'),
  });

  const initialFormValues: any = { name, app_name, api_key, shortcode, phone };

  const createTooltip = (title: any) => (
    <Tooltip
      tooltipClass={`${styles.Tooltip} `}
      tooltipArrowClass={styles.TooltipArrow}
      title={title}
      placement="right"
    >
      <InfoIcon className={styles.InfoIcon} />
    </Tooltip>
  );

  const appNameTooltip = createTooltip(
    <p>
      Login to your{' '}
      <a href="https://www.gupshup.io/" target="_blank">
        gupshup account
      </a>{' '}
      <br /> Go to the dashboard section to find your bot name & number.
    </p>
  );

  const apiTooltip = createTooltip(
    <p>
      Login to your{' '}
      <a href="https://www.gupshup.io/" target="_blank">
        gupshup account
      </a>
      <br />
      Go to the dashboard section
      <br />
      Click on account icon on top right to find API keys.
    </p>
  );

  const formFields = [
    {
      component: Input,
      name: 'name',
      type: 'text',
      inputLabel: 'Organization registered name',
      disabled: isDisabled,
    },
    {
      component: PhoneInput,
      name: 'phone',
      type: 'phone',
      inputLabel: 'Chatbot number',
      helperText: 'New whatsapp chatbot number',
      disabled: isDisabled,
    },
    {
      component: Input,
      name: 'app_name',
      type: 'text',
      inputLabel: 'App name',
      inputLabelSubtext: (
        <p className={styles.SubText}>(Name of your bot on Gupshup.){appNameTooltip}</p>
      ),
      disabled: isDisabled,
    },
    {
      component: Input,
      name: 'api_key',
      type: 'text',
      inputLabel: 'Gupshup API keys',
      inputLabelSubtext: (
        <span className={styles.SubText}>(Click here to get the API keys) {apiTooltip}</span>
      ),
      disabled: isDisabled,
    },
    {
      component: Input,
      name: 'shortcode',
      type: 'text',
      inputLabel: 'URL shortcode',
      helperText: 'Atleast 7-8 characters',
      inputLabelSubtext: (
        <span className={styles.SubText}>(Name you want to give your Glific platform)</span>
      ),
      disabled: isDisabled,
    },
  ];

  const setPayload = (payload: any) => {
    const { app_name, shortcode, api_key, phone, name, token } = payload;

    return {
      api_key,
      app_name,
      phone,
      shortcode,
      name,
      token,
    };
  };

  const handleSubmit = async (payload: any, setErrors: Function) => {
    if (isDisabled) handleStepChange();
    setLoading(true);
    await axios.post(ONBOARD_URL_SETUP, payload).then(({ data }) => {
      setLoading(false);
      if (data.is_valid) {
        saveData(
          {
            registration_id: data.registration_id,
            org_id: data.organization?.id,
            submitted: true,
          },
          'registration_details'
        );

        handleStepChange();

        return true;
      } else {
        setErrors(data.messages);
        saveData(data.messages, 'errors');
        return false;
      }
    });
  };

  const setStates = (states: any) => {
    const { api_key, app_name, phone, shortcode, name } = states;

    setOrgName(name);
    setAppName(app_name);
    setShortcode(shortcode);
    setApiKeys(api_key);
    setPhone(phone);
  };

  useEffect(() => {
    const data = localStorage.getItem('registrationData');
    let registrationData;
    if (data) {
      registrationData = JSON.parse(data);
      if (registrationData.registration_details && registrationData.registration_details.submitted)
        setIsDisabled(true);
    }
  }, []);

  return (
    <FormLayout
      validationSchema={FormSchema}
      formFieldItems={formFields}
      initialValues={initialFormValues}
      step={1}
      title="Bot details"
      helperText="Add platform details and information based on the data queries."
      setStates={setStates}
      setPayload={setPayload}
      identifier="platformDetails"
      handleStepChange={handleStepChange}
      saveData={saveData}
      loading={loading}
      submitData={handleSubmit}
      showModal={true}
      isDisabled={isDisabled}
    />
  );
};
