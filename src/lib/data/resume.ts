export const resume = {
	name: 'Julian Roberts',
	title: 'Senior Software Engineer',
	tagline: 'Full stack engineer building scalable systems from requirements to production',
	email: 'julian.roberts.one@gmail.com',
	location: 'Arvada, CO',
	links: {
		github: 'https://github.com/julian-one',
		linkedin: 'https://www.linkedin.com/in/julian-one/'
	},
	bio: `I'm a senior software engineer with a Master's in Computer Science and over 7 years of experience building full stack applications. From healthcare systems at UCLA to telecommunications infrastructure at Dish Network to insurance technology at Westhill Global, I've designed and delivered scalable solutions that serve thousands of users daily. I specialize in Go, TypeScript, and Svelte, with deep experience in cloud platforms like GCP and AWS.`,
	education: [
		{
			school: 'University of Colorado, Denver',
			degree: 'Master of Science, Computer Science',
			period: '2020 - 2022'
		},
		{
			school: 'Pitzer College',
			degree: 'Bachelor of Arts, Biophysics',
			period: '2013 - 2017'
		}
	],
	experience: [
		{
			company: 'Westhill Global',
			role: 'Senior Software Engineer (Full Stack)',
			period: 'Dec 2023 - Present',
			location: 'Remote',
			description:
				'Leading development of fully-digital managed repair solution connecting insurance carriers, homeowners, and contractors. Designed complete infrastructure using Svelte, Golang, PostgreSQL, and GCP services including Cloud Run, Pub/Sub, Spanner, BigQuery, and Vertex AI. Containerized deployments with Docker and Kubernetes. Rearchitected systems for improved scalability and fault tolerance.'
		},
		{
			company: 'Dish Network',
			role: 'Senior Software Engineer (Backend)',
			period: 'Feb 2022 - Nov 2023',
			location: 'Denver, CO',
			description:
				'Designed and built microservices infrastructure supporting Boost Mobile applications with thousands of daily active users. Rearchitected legacy systems using TypeScript, CDK, and PostgreSQL with AWS services including EC2, Lambda, and API Gateway. Served as principal backend engineer for Retail Wireless Digital Interactions team. Managed development lifecycle with GitLab CI/CD.'
		},
		{
			company: 'David Geffen School of Medicine (UCLA)',
			role: 'Program Analyst II & III (Full Stack)',
			period: 'Aug 2017 - Jul 2020',
			location: 'Los Angeles, CA',
			description:
				'Built web, mobile, and database applications for medical research using OpenACS, Tcl, NaviServer, PostgreSQL, and Oracle. Developed frontend interfaces with vanilla JavaScript, jQuery, Bootstrap, and CSS. Managed AWS infrastructure including EC2, Route53, Lambda, and API Gateway. Used SVN and GitLab for version control in HIPAA-regulated environment.'
		}
	],
	skills: {
		languages: [
			{ name: 'JavaScript', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'TypeScript', years: 4, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }] },
			{ name: 'Go', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'Python', years: 5, breakdown: [{ job: 'CU Denver', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'SQL', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'C++', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Java', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Tcl', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] },
			{ name: 'CSS', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] }
		],
		frontend: [
			{ name: 'Svelte', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'SvelteKit', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'React', years: 2, breakdown: [{ job: 'Dish', years: 2 }] },
			{ name: 'Tailwind CSS', years: 3, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 1 }] },
			{ name: 'jQuery', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] },
			{ name: 'Bootstrap', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] }
		],
		backend: [
			{ name: 'REST APIs', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'Microservices', years: 4, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }] },
			{ name: 'PostgreSQL', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'Oracle', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] },
			{ name: 'Node.js', years: 4, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }] },
			{ name: 'OpenACS', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] },
			{ name: 'NaviServer', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] }
		],
		cloud: [
			{ name: 'AWS', years: 5, breakdown: [{ job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'EC2', years: 5, breakdown: [{ job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'Lambda', years: 4, breakdown: [{ job: 'Dish', years: 2 }, { job: 'UCLA', years: 2 }] },
			{ name: 'API Gateway', years: 4, breakdown: [{ job: 'Dish', years: 2 }, { job: 'UCLA', years: 2 }] },
			{ name: 'Route53', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] },
			{ name: 'GCP', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'Cloud Run', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'Pub/Sub', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'Spanner', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'BigQuery', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'Vertex AI', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] },
			{ name: 'Docker', years: 4, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }] },
			{ name: 'Kubernetes', years: 2, breakdown: [{ job: 'Westhill', years: 2 }] }
		],
		tools: [
			{ name: 'Git', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'GitLab', years: 5, breakdown: [{ job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'SVN', years: 3, breakdown: [{ job: 'UCLA', years: 3 }] },
			{ name: 'Linux', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] },
			{ name: 'CI/CD', years: 6, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 2 }] },
			{ name: 'CDK', years: 2, breakdown: [{ job: 'Dish', years: 2 }] },
			{ name: 'Agile', years: 7, breakdown: [{ job: 'Westhill', years: 2 }, { job: 'Dish', years: 2 }, { job: 'UCLA', years: 3 }] }
		],
		data: [
			{ name: 'TensorFlow', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'NumPy', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Pandas', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Jupyter', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Hadoop', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Kafka', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] },
			{ name: 'Android Studio', years: 2, breakdown: [{ job: 'CU Denver', years: 2 }] }
		]
	}
};
