### `/util`

<br/>

1. `create-attendee-handle-map.js`

-   This command could be run _once_ on: `attendees.adoc` files from `./../summary/sessions` directory.

-   Run the following command.

```node
node create-attendee-handle-map.js
```

-   Creates a `map.json`.

```json
[
	{
		"name": "Tushar Nankani",
		"handle": "https://twitter.com/tusharnankanii"
	}
]
```

<br/><br/>

2. `map-handles-to-catchup-attendees.js`

-   This command has to run everytime after creating `./../summary/sessions/<catchup-number>/attendees.adoc`.

Steps:

-   Create `attendees.adoc`.
-   Paste the list of names.

```
Tushar Nankani
Dheeraj Lalwani
Sirus
```

-   Run the following command.

```node
node map-handles-to-catchup-attendees.js <catchup-number>
```

-   Final `attendees.adoc`.

```
==== Attendees

. link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
. link:https://twitter.com/tusharnankanii[Tushar Nankani^]
. Sirus

```
