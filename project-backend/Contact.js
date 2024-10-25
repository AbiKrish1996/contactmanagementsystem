// pages/api/contacts.js


export default async function handler(req, res) {
    const { name, email, timezone } = req.query;
    const { sort, order } = req.query;

    const where = {};
    if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
    }
    if (email) {
        where.email = { [Op.iLike]: `%${email}%` };
    }
    if (timezone) {
        where.timezone = timezone;
    }

    const options = {
        where,
        order: [[sort || 'name', order || 'ASC']]
    };

    try {
        const contacts = await Contact.findAll(options);
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
    // pages/api/contacts/[id].js
       const { id } = req.query;

    if (req.method === 'PUT') {
        const { name, email, phoneNumber, address, timezone } = req.body;

        try {
            const contact = await Contact.findByPk(id);
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
            }

            await contact.update({
                name,
                email,
                phoneNumber,
                address,
                timezone
            });

            res.status(200).json(contact);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(405).end();
    }
    
    // pages/api/contacts/[id].js
    if (req.method === 'DELETE') {
        try {
            const contact = await Contact.findByPk(id);
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
            }

            await contact.update({ isDeleted: true });

            res.status(200).json({ message: 'Contact deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).end();
    }


}