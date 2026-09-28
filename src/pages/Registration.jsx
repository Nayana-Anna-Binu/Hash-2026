import { Check, TicketCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useParticipants } from '../context/ParticipantsContext.jsx';
import Modal from '../components/Modal.jsx';
import useFetchEvents from '../hooks/useFetchEvents.js';

const initialValues = { fullName: '', email: '', phone: '', selectedEvent: '', collegeName: '', password: '' };
const patterns = {
  fullName: /^(?=.{3,60}$)(?=(?:.*[A-Za-z]){3,})[A-Za-z][A-Za-z\s.'-]*$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{6,30}$/
};
const fieldMessages = {
  fullName: 'Enter a name with at least 3 letters.',
  email: 'Enter a valid email address.',
  phone: 'Enter a 10-digit number starting with 6–9.',
  password: 'Use 6–30 characters with an uppercase letter, lowercase letter, and number.'
};

function validate(values, events) {
  const errors = {};
  ['fullName', 'email', 'phone', 'password'].forEach(field => {
    if (!values[field].trim() || !patterns[field].test(values[field].trim())) {
      errors[field] = fieldMessages[field];
    }
  });
  if (!events.some(event => event.id === values.selectedEvent)) errors.selectedEvent = 'Choose a valid event from the list.';
  if (!values.collegeName.trim()) errors.collegeName = 'Enter your college or organization.';
  return errors;
}

export default function Registration() {
  const { eventId } = useParams();
  const { events, loading, error } = useFetchEvents();
  const { participants, saveParticipants, storageError } = useParticipants();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (eventId && events.some(event => event.id === eventId)) {
      setValues(current => ({ ...current, selectedEvent: eventId }));
    }
  }, [eventId, events]);

  const eventById = useMemo(() => new Map(events.map(event => [event.id, event])), [events]);

  const updateField = event => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setTouched(current => ({ ...current, [name]: true }));
    const nextErrors = validate(nextValues, events);
    setErrors(current => ({ ...current, [name]: nextErrors[name] || '' }));
  };

  const blurField = event => {
    const { name } = event.target;
    setTouched(current => ({ ...current, [name]: true }));
    const fieldErrors = validate(values, events);
    setErrors(current => ({ ...current, [name]: fieldErrors[name] || '' }));
  };

  const submitForm = event => {
    event.preventDefault();
    const nextErrors = validate(values, events);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(Object.keys(values).map(key => [key, true])));
    if (Object.keys(nextErrors).length) return;

    const selected = eventById.get(values.selectedEvent);
    if (!selected) {
      setErrors(current => ({ ...current, selectedEvent: 'This event is no longer available. Choose another event.' }));
      return;
    }

    const participant = {
      id: crypto.randomUUID(),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      selectedEvent: selected.id,
      eventTitle: selected.title,
      collegeName: values.collegeName.trim(),
      bookingId: `TF26-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    const nextParticipants = [...participants, participant];

    if (saveParticipants(nextParticipants)) {
      setConfirmation(participant);
      setValues(initialValues);
      setErrors({});
      setTouched({});
    }
  };

  const fieldClass = name => {
    const value = values[name].trim();
    if (!touched[name] || !value) return `form-field ${errors[name] ? 'has-error' : ''}`;
    return `form-field ${errors[name] ? 'has-error' : 'is-valid'}`;
  };
  const errorFor = name => errors[name] && <small id={`${name}-error`} className="field-error">{errors[name]}</small>;

  return (
    <div className="page-container container registration-layout">
      <section className="page-intro">
        <span className="eyebrow">YOUR STORY STARTS HERE</span>
        <h1>Save your <span>spot.</span></h1>
        <p>One quick form, a whole lot of possibilities.</p>
        <div className="registration-aside"><TicketCheck size={21} /><span>Your registration is stored in this browser. Organizers manage attendee records separately.</span></div>
      </section>
      <form id="registrationForm" className="registration-form panel" onSubmit={submitForm} noValidate>
          <div className="form-heading"><span className="eyebrow">TECHFEST 2026 · REGISTRATION</span><h2>Let’s get you in.</h2><p>Fields marked <b>*</b> are required. Password is validated but never stored.</p></div>
          {storageError && <p className="storage-error" role="alert">{storageError}</p>}
          <div className={fieldClass('fullName')}><label htmlFor="fullName">Full name <b>*</b></label><input id="fullName" name="fullName" value={values.fullName} onChange={updateField} onBlur={blurField} placeholder="Your name" autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'fullName-error' : undefined} />{errorFor('fullName')}</div>
          <div className="form-row">
            <div className={fieldClass('email')}><label htmlFor="email">Email address <b>*</b></label><input id="email" name="email" type="email" value={values.email} onChange={updateField} onBlur={blurField} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errorFor('email')}</div>
            <div className={fieldClass('phone')}><label htmlFor="phone">Phone number <b>*</b></label><input id="phone" name="phone" type="tel" inputMode="numeric" value={values.phone} onChange={event => updateField({ target: { name: 'phone', value: event.target.value.replace(/\D/g, '').slice(0, 10) } })} onBlur={blurField} placeholder="10-digit number" autoComplete="tel-national" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />{errorFor('phone')}</div>
          </div>
          <div className={fieldClass('collegeName')}><label htmlFor="collegeName">College / organization <b>*</b></label><input id="collegeName" name="collegeName" value={values.collegeName} onChange={updateField} onBlur={blurField} placeholder="Where are you joining from?" autoComplete="organization" aria-invalid={Boolean(errors.collegeName)} aria-describedby={errors.collegeName ? 'collegeName-error' : undefined} />{errorFor('collegeName')}</div>
          <div className={fieldClass('selectedEvent')}><label htmlFor="selectedEvent">Choose an event <b>*</b></label><select id="selectedEvent" name="selectedEvent" value={values.selectedEvent} onChange={updateField} onBlur={blurField} disabled={loading || Boolean(error)} aria-invalid={Boolean(errors.selectedEvent)} aria-describedby={errors.selectedEvent ? 'selectedEvent-error' : undefined}><option value="">{loading ? 'Loading events…' : error ? 'Events unavailable' : 'Pick your event'}</option>{events.map(item => <option key={item.id} value={item.id}>{item.title} · ₹{item.fee}</option>)}</select>{error && <small className="field-error">{error}</small>}{errorFor('selectedEvent')}          </div>
          <div className={fieldClass('password')}><label htmlFor="password">Password <b>*</b></label><input id="password" name="password" type="password" value={values.password} onChange={updateField} onBlur={blurField} placeholder="6–30 chars, upper/lowercase & number" autoComplete="new-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} />{errorFor('password')}</div>
          <div className="registration-actions">
            <button className="button button-primary button-submit" type="submit" disabled={loading || Boolean(error)}>Complete registration <Check size={17} /></button>
          </div>
      </form>
      {confirmation && <Modal title="You’re on the list!" onClose={() => setConfirmation(null)}><div className="confirmation-content"><div className="confirmation-icon"><Check size={24} /></div><p>Your TechFest registration is confirmed. See you there!</p><dl><div><dt>Booking ID</dt><dd>{confirmation.bookingId}</dd></div><div><dt>Attendee</dt><dd>{confirmation.fullName}</dd></div><div><dt>Event</dt><dd>{confirmation.eventTitle}</dd></div></dl><button className="button button-primary button-full" onClick={() => setConfirmation(null)}>Amazing, thanks!</button></div></Modal>}
    </div>
  );
}
