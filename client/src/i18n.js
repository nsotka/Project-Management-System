import i18n from 'i18next';
// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: ['fi', 'en'],
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    resources: {
      en: {
        translation: {
          navigation: {
            active_project: "Active project",
            backlog: "Backlog",
            dashboard: "Dashboard",
            language: "Lang",
            management: "Management",
            new_project: "New project",
            project: "Project",
            signout: "Sign out",
            sprints: "Sprints",
            users: "Users",
          },
          dashboard: {
            closed: "Closed",
            multiple_invitations: "{{count}} new invitations",
            no_open_invitations: "No open invitations",
            no_sprints: "Project doesn't have any sprints",
            open: "Open",
            open_invitations: "Open invitations",
            project_chat: "Project chat",
            single_invitation: "{{count}} new invitation",
            sprints: "Sprints",
            statistics: "Statistics",
            tasks: "Tasks",
            total: "Total",
            under_development: "Feature is under development",
          },
          backlog: {
            create_task: "Create task",
            update_task: "Edit task",
          },
          menu: {
            change_active: "Change to active",
            close_sprint: "Close sprint",
            delete_sprint: "Delete sprint",
            delete_task: "Delete task",
            edit_sprint: "Edit sprint",
            edit_task: "Edit task",
            move_to_backlog: "Move back to backlog",
            move_to_sprint: "Move to sprint",
            open_sprint: "Open sprint",
          },
          modal: {
            add: "Add",
            add_users: "Add users",
            cancel: "Cancel",
            category: "Category",
            choose_task_users: "Choose users for the task",
            confirm_delete: "Confirm deletion",
            confirmation_delete_text: "Are you sure you want to delete item {{target}}",
            create_project: "Create project",
            create_sprint: "Create sprint",
            delete: "Delete",
            description: "Description",
            dueDatetime: "Due datetime",
            edit_sprint: "Edit sprint",
            name: "Name",
            save: "Save",
            startDatetime: "Start datetime",
            title: "Title",
          },
          user_management: {
            add_members: "Add members",
            no_members: "Project hasn't any members",
            project_members: "Project members",
          },
          input_label: {
            sprint: "Sprint"
          },
          task: {
            status: {
              completed: "Completed",
              ongoing: "In Progress",
              planned: "Planned",
            }
          },
          titles: {
            accept: "Accept",
            active: "Active",
            closed: "Closed",
            closed_tasks: "Closed tasks",
            name: "Name",
            open: "Open",
            project_name: "Project's name",
            reject: "Reject",
            status: "Status",
          }
        }
      },
      fi: {
        translation: {
          error: {
            tasks_in_sprint: ""
          },
          navigation: {
            active_project: "Aktiivinen projekti",
            backlog: "Kehitysjono",
            dashboard: "Ohjausnäkymä",
            language: "Kieli",
            management: "Hallinta",
            new_project: "Uusi projekti",
            project: "Projekti",
            signout: "Kirjaudu ulos",
            sprints: "Sprintit",
            users: "Käyttäjät",
          },
          dashboard: {
            closed: "Suljettu",
            multiple_invitations: "{{count}} uutta kutsua",
            no_open_invitations: "Ei avoimia kutsuja",
            no_sprints: "Projektilla ei ole yhtään sprinttiä",
            open_invitations: "Avoimet kutsut",
            open: "Avoinna",
            project_chat: "Projekti keskustelu",
            single_invitation: "{{count}} uusi kutsu",
            sprints: "Sprintit",
            statistics: "Tunnusluvut",
            tasks: "Tehtävät",
            total: "Yhteensä",
            under_development: "Toiminto on kehitteillä",
          },
          backlog: {
            create_task: "Uusi tehtävä",
          },
          login: {
            email: "Sähköpostiosoite",
            login: "Kirjaudu",
            password: "Salasana",
          },
          menu: {
            change_active: "Muuta aktiiviseksi",
            close_sprint: "Sulje sprintti",
            delete_sprint: "Poista sprintti",
            delete_task: "Poista tehtävä",
            edit_sprint: "Muokkaa sprinttiä",
            edit_task: "Muokkaa tehtävää",
            move_to_backlog: "Siirrä kehitysjonoon",
            move_to_sprint: "Siirrä sprinttiin",
            open_sprint: "Avaa sprintti",
          },
          modal: {
            add: "Lisää",
            add_email: "Lisää s-posti",
            add_users: "Lisää käyttäjiä",
            cancel: "Peruuta",
            category: "Kategoria",
            choose_task_users: "Valitse tehtävälle tekijät",
            confirm_delete: "Vahvista poisto",
            confirmation_delete_text: "Oletko varma, että haluat poistaa kohteen {{target}}",
            create_project: "Luo projekti",
            create_sprint: "Luo sprintti",
            delete: "Poista",
            description: "Kuvaus",
            dueDatetime: "Päättymisaika",
            edit_sprint: "Muokkaa sprinttiä",
            name: "Nimi",
            role: "Rooli",
            save: "Tallenna",
            startDatetime: "Aloitusaika",
            title: "Otsikko",
          },
          user_management: {
            add_members: "Lisää jäseniä",
            no_members: "Projektilla ei ole yhtään osallistujaa",
            project_members: "Projektin jäsenet",
          },
          input_label: {
            sprint: "Sprintti"
          },
          task: {
            dueInDays: {
              long: "Määräaika umpeutuu {{days}} kuluttua",
              short: "{{days}}pv"
            },
            dueDaysAgo: {
              long: "Määräaika umpetui {{days}} päivää sitten",
              short: "{{days}}pv"
            },
            dueInHours: {
              long: "Määräaika umpeutuu {{hours}}h {{minutes}}min kuluttua",
              short: "{{hours}}h {{minutes}}min"
            },
            dueHoursAgo: {
              long: "Määräaika umpeutui {{hours}}h {{minutes}}min sitten",
              short: "{{hours}}h {{minutes}}min"
            },
            status: {
              completed: "Valmistunut",
              ongoing: "Meneillään",
              planned: "Suunniteltu",
              testing: "Testaus"
            }
          },
          validation: {
            is_required: "{{field}} on vaadittu",
            no_empty: "{{field}} ei voi olla tyhjä",
            wrong_format: "{{field}} väärässä muodossa"
          }
        }
      }
    }
  });

export default i18n;