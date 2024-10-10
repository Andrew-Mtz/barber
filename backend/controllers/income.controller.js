import pool from "../db.js";

const getBarberWorkDetail = async (req, res) => {
  try {
    const year = req.query.year; // Por ejemplo, req.query.date sería "2022-08-17".
    const month = req.query.month;
    const resultsDetails = await getBarberDetail(year, month);
    const resultsTotalIncomes = await getTotalIncomeByBarber(year, month)

    const organizedData = {};

    resultsDetails.forEach(detail => {
      const { barber_id, barber_name, barber_lastname, haircut, price, date, hour, user_name, user_lastname } = detail;
      const fecha = new Date(date);
      const fechaFormateada = fecha.toISOString().split('T')[0];
      let total_daily_income = 0

      if (!organizedData[barber_id]) {
        organizedData[barber_id] = {
          barber_name: `${barber_name} ${barber_lastname}`, // O cualquier otro campo que desees mostrar
          total_monthly_income: 0,
          dates: {}
        };
      }

      if (!organizedData[barber_id].dates[fechaFormateada]) {
        organizedData[barber_id].dates[fechaFormateada] = {
          total_daily_income: 0,
          date_info: []
        };
      }

      organizedData[barber_id].dates[fechaFormateada].total_daily_income += parseInt(price);

      organizedData[barber_id].dates[fechaFormateada].date_info.push({
        haircut_name: haircut,
        price,
        hour,
        user_name,
        user_lastname
      });
    });

    // Agregar el precio total por barbero desde los resultados de la otra consulta
    resultsTotalIncomes.forEach(totalPrice => {
      const { barber_id, total_price_by_barbero } = totalPrice;

      if (organizedData[barber_id]) {
        organizedData[barber_id].total_monthly_income = total_price_by_barbero;
      }
    });
    res.json(organizedData)
  } catch (error) {
    console.log(error)
  }
}

const getBarberDetail = async (year, month) => {
  try {
    const result = await pool.query(
      `SELECT 
      bk.id,
      b.id as barber_id,
      b.name as barber_name,
      b.last_name as barber_lastname,
      h.name as haircut,
      h.price,
      s.date,
      av.hour,
      c.name as user_name,
      c.last_name as user_lastname
    FROM 
      booking AS bk
    LEFT JOIN 
      haircuts AS h ON bk.haircut_id = h.id
    LEFT JOIN 
      schedules AS s ON bk.date_id = s.id
    LEFT JOIN 
      clients AS c ON bk.client_id = c.id
    LEFT JOIN 
      barbers AS b ON bk.barber_id = b.id
    LEFT JOIN 
      available_schedules AS av ON bk.schedule_id = av.id
    WHERE 
      bk.status = 'expired' 
      AND EXTRACT(YEAR FROM s.date) = $1 
      AND EXTRACT(MONTH FROM s.date) = $2`, [year, month])
    return result.rows
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getTotalIncomeByBarber = async (year, month) => {
  try {
    const result = await pool.query(
      `SELECT 
          b.barber_id, 
          SUM(h.price) AS total_price_by_barbero
      FROM 
          booking AS b
      LEFT JOIN 
          haircuts AS h ON b.haircut_id = h.id
      LEFT JOIN 
          schedules AS s ON b.date_id = s.id
      WHERE 
          b.status = 'expired' 
          AND EXTRACT(YEAR FROM s.date) = $1
          AND EXTRACT(MONTH FROM s.date) = $2
      GROUP BY 
          b.barber_id`, [year, month]
    );
    return result.rows
  } catch (error) {
    console.log(error);
    throw error
  }
}

export {
  getBarberWorkDetail
}