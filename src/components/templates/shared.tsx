import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Calendar,
  Award,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { PersonalInfo } from '../../types/resume';

export const ContactBar: React.FC<{
  personal: PersonalInfo;
  iconClass?: string;
  itemClass?: string;
  wrapperClass?: string;
  linkClass?: string;
}> = ({
  personal,
  iconClass = 'w-3.5 h-3.5 text-slate-500',
  itemClass = 'flex items-center gap-1.5 text-xs text-slate-600',
  wrapperClass = 'flex flex-wrap items-center gap-x-4 gap-y-1.5',
  linkClass = 'hover:underline text-slate-700',
}) => {
  const { fieldVisibility } = personal;

  return (
    <div className={wrapperClass}>
      {fieldVisibility.email && personal.email && (
        <a href={`mailto:${personal.email}`} className={`${itemClass} ${linkClass}`}>
          <Mail className={iconClass} />
          <span>{personal.email}</span>
        </a>
      )}
      {fieldVisibility.phone && personal.phone && (
        <a href={`tel:${personal.phone}`} className={`${itemClass} ${linkClass}`}>
          <Phone className={iconClass} />
          <span>{personal.phone}</span>
        </a>
      )}
      {fieldVisibility.location && personal.location && (
        <span className={itemClass}>
          <MapPin className={iconClass} />
          <span>{personal.location}</span>
        </span>
      )}
      {fieldVisibility.website && personal.website && (
        <a
          href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`}
          target="_blank"
          rel="noreferrer"
          className={`${itemClass} ${linkClass}`}
        >
          <Globe className={iconClass} />
          <span>{personal.website.replace(/^https?:\/\//, '')}</span>
        </a>
      )}
      {fieldVisibility.linkedin && personal.linkedin && (
        <a
          href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className={`${itemClass} ${linkClass}`}
        >
          <LinkedinIcon className={iconClass} />
          <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}</span>
        </a>
      )}
      {fieldVisibility.github && personal.github && (
        <a
          href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`}
          target="_blank"
          rel="noreferrer"
          className={`${itemClass} ${linkClass}`}
        >
          <GithubIcon className={iconClass} />
          <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/')}</span>
        </a>
      )}
    </div>
  );
};
