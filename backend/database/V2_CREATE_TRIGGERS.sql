-- Function to create the associated review when a booking is created
CREATE OR REPLACE FUNCTION create_initial_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar en la tabla reviews sin el nombre y apellido
    INSERT INTO reviews (client_id, barber_id, booking_id, haircuts_id, comment, rating, created_at, is_pending)
    VALUES (NEW.client_id, NEW.barber_id, NEW.id, NEW.haircut_id, null, null, NOW(), true);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

	-- Trigger to execute the create_initial_review function after a booking is created
CREATE TRIGGER create_review_trigger
AFTER INSERT ON booking
FOR EACH ROW
EXECUTE FUNCTION create_initial_review();


-- Function to delete the associated review when a booking is canceled
CREATE OR REPLACE FUNCTION delete_associated_review()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM reviews WHERE booking_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the delete_associated_review function after a booking is deleted
CREATE TRIGGER delete_review_trigger
AFTER DELETE ON booking
FOR EACH ROW
EXECUTE FUNCTION delete_associated_review();

CREATE OR REPLACE FUNCTION update_schedule_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE available_schedules SET status = 2 WHERE id = NEW.schedule_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE available_schedules SET status = 1 WHERE id = OLD.schedule_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schedule_trigger
AFTER INSERT OR DELETE ON booking
FOR EACH ROW
EXECUTE FUNCTION update_schedule_status();