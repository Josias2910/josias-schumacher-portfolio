import type { ImageMetadata } from 'astro';

interface NavLink {
	label: string;
	href?: string;
	dropdownTitle?: string;
	sublinks?: {
		label: string;
		href: string;
		submenu?: {
			label: string;
			href: string;
		}[];
	}[];
}

interface SocialLink {
	label: string;
	href: string;
}

export interface Entity {
	id: EntityId;
	name: string;
	status: 'active' | 'soon';
	description: string;
	siteUrl?: string;
}

export type EntityId =
	| 'amproer';


export const navigationLinks: NavLink[] = [
	{
    label: 'Amproer',
    href: '/amproer/',
    dropdownTitle: 'Secciones de AMPROER',
    sublinks: [
        {
            label: 'Filiales',
            href: '/sucursales',
        },
        {
            label: 'Subsidios',
            href: '/servicios',
        },
    ],
	},
	{
		label: 'Ayudas Económicas',
		dropdownTitle: 'Servicios Financieros',
		sublinks: [
			{
				label: 'Personas',
				href: '#',
				submenu: [
					{
						label: 'Ayudas Económicas',
						href: '/ayudas-economicas',
					},
					{
						label: 'Sistema PRESTAPP',
						href: '/prestapp',
					},
					{
						label: 'Adelanto Haberes',
						href: '/adelanto-de-haberes',
					},
				],
			},

			{
				label: 'Comercios',
				href: '#',
				submenu: [
					{
						label: 'Ayudas Económicas',
						href: '/comercios-y-empresas',
					},
					{
						label: 'Sistema PRESTAPP',
						href: '/que-es-prestapp',
					},
				],
			},
		],
	},

	{
		label: 'Proveeduría Mutual',
		href: '/electro-mutual',
	},

	{
		label: 'Ahorro a Término',
		href: '/plazo-fijo-mutual',
	},

	{
		label: 'Atención al Socio',
		href: '/contacto',
	},
];


export const socialLinks: SocialLink[] = [
	{
		label: 'Facebook',
		href: 'https://www.facebook.com/amuproer/?locale=es_LA'
	},
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/mutual_amproer/'
	},
];


export const legalLinks: NavLink[] = [
	{
		label: 'Políticas de privacidadles',
		href: '/terminos-y-condiciones-de-uso-del-sitioy-politica-de-privacidad',
	}
];


export const entities: Entity[] = [
	{
		id: 'amproer',
		name: 'AMPROER',
		status: 'active',
		description:
			'Asociación Mutual del Personal de la Organización de Entre Ríos. Brindando servicios financieros, turísticos y sociales a nuestros asociados.',
		siteUrl: 'https://amproer.com/',
	},
];